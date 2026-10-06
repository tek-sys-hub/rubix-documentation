// A small, honest evaluator for the playground. It runs the body of `fn main`
// when it only contains `let` bindings, assignments, arithmetic and
// `println`/`print`. Anything else is reported as unsupported rather than
// faked.

const INT_TYPES = new Set(["i8", "i16", "i32", "i64", "isize", "u8", "u16", "u32", "u64", "usize"]);
const FLOAT_TYPES = new Set(["f32", "f64"]);

export class PreviewError extends Error {
  constructor(message, line = null, unsupported = false) {
    super(message);
    this.line = line;
    this.unsupported = unsupported;
  }
}

/**
 * Replace comments with spaces (and optionally string contents too) while
 * keeping every character offset and newline in place.
 */
function scan(src, blankStrings) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (c === "/" && n === "/") {
      while (i < src.length && src[i] !== "\n") {
        out += " ";
        i++;
      }
    } else if (c === "/" && n === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      while (i < stop) {
        out += src[i] === "\n" ? "\n" : " ";
        i++;
      }
    } else if (c === '"') {
      out += c;
      i++;
      while (i < src.length && src[i] !== '"' && src[i] !== "\n") {
        if (src[i] === "\\" && i + 1 < src.length && src[i + 1] !== "\n") {
          out += blankStrings ? "  " : src[i] + src[i + 1];
          i += 2;
        } else {
          out += blankStrings ? " " : src[i];
          i++;
        }
      }
      if (src[i] === '"') {
        out += '"';
        i++;
      }
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

const lineAt = (src, index) => src.slice(0, index).split("\n").length;

function extractMain(src) {
  const masked = scan(src, true);
  const head = /\bfn\s+main\s*\(\s*\)\s*\{/.exec(masked);
  if (!head) throw new PreviewError("no `fn main()` found; a program needs an entry point");
  const open = head.index + head[0].length - 1;
  let depth = 0;
  let close = -1;
  for (let i = open; i < masked.length; i++) {
    if (masked[i] === "{") depth++;
    else if (masked[i] === "}") {
      depth--;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) throw new PreviewError("this file contains an unclosed delimiter `{`", lineAt(src, open));
  return { body: scan(src, false).slice(open + 1, close), firstLine: lineAt(src, open) };
}

const ESCAPES = { n: "\n", t: "\t", '"': '"', "\\": "\\", 0: "\0" };

function tokenize(expr) {
  const re = /\s*(?:("(?:[^"\\]|\\.)*")|(\d[\d_]*(?:\.\d[\d_]*)?)|([A-Za-z_]\w*)|(::|\S))/y;
  const tokens = [];
  let m;
  while ((m = re.exec(expr)) !== null) {
    if (m[1]) tokens.push({ kind: "str", value: m[1].slice(1, -1).replace(/\\(.)/g, (_, ch) => ESCAPES[ch] ?? ch) });
    else if (m[2]) tokens.push({ kind: "num", value: m[2].replace(/_/g, "") });
    else if (m[3]) tokens.push({ kind: "ident", value: m[3] });
    else tokens.push({ kind: "punct", value: m[4] });
  }
  return tokens;
}

function binary(op, l, r, line) {
  if (op === "+" && l.type === "str" && r.type === "str") return { type: "str", value: l.value + r.value };
  if (l.type !== r.type || (l.type !== "i64" && l.type !== "f64")) {
    throw new PreviewError(`cannot apply \`${op}\` to \`${l.type}\` and \`${r.type}\``, line);
  }
  if (l.type === "i64" && (op === "/" || op === "%") && r.value === 0) {
    throw new PreviewError("attempt to divide by zero", line);
  }
  let value;
  if (op === "+") value = l.value + r.value;
  else if (op === "-") value = l.value - r.value;
  else if (op === "*") value = l.value * r.value;
  else if (op === "/") value = l.type === "i64" ? Math.trunc(l.value / r.value) : l.value / r.value;
  else value = l.value % r.value;
  return { type: l.type, value };
}

function evaluate(expr, scope, line) {
  const tokens = tokenize(expr);
  let i = 0;
  const peek = () => tokens[i];
  const unsupported = () =>
    new PreviewError(`the browser preview can't evaluate \`${expr.trim()}\``, line, true);

  function primary() {
    const t = tokens[i++];
    if (!t) throw new PreviewError("expected an expression", line);
    if (t.kind === "num") {
      return t.value.includes(".")
        ? { type: "f64", value: parseFloat(t.value) }
        : { type: "i64", value: parseInt(t.value, 10) };
    }
    if (t.kind === "str") return { type: "str", value: t.value };
    if (t.kind === "ident") {
      if (t.value === "true" || t.value === "false") return { type: "bool", value: t.value === "true" };
      const next = peek();
      if (next && ["(", ".", "::", "{", "["].includes(next.value)) throw unsupported();
      if (!(t.value in scope)) throw new PreviewError(`cannot find value \`${t.value}\` in this scope`, line);
      return scope[t.value].value;
    }
    if (t.value === "(") {
      const inner = additive();
      if (peek()?.value !== ")") throw new PreviewError("expected `)`", line);
      i++;
      return inner;
    }
    if (t.value === "-") {
      const operand = primary();
      if (operand.type !== "i64" && operand.type !== "f64") {
        throw new PreviewError(`cannot apply unary operator \`-\` to type \`${operand.type}\``, line);
      }
      return { type: operand.type, value: -operand.value };
    }
    throw unsupported();
  }

  function multiplicative() {
    let left = primary();
    while (peek() && ["*", "/", "%"].includes(peek().value)) {
      const op = tokens[i++].value;
      left = binary(op, left, primary(), line);
    }
    return left;
  }

  function additive() {
    let left = multiplicative();
    while (peek() && ["+", "-"].includes(peek().value)) {
      const op = tokens[i++].value;
      left = binary(op, left, multiplicative(), line);
    }
    return left;
  }

  const result = additive();
  if (i < tokens.length) throw unsupported();
  return result;
}

const display = (v) => String(v.value);

function splitArgs(src) {
  const parts = [];
  let depth = 0;
  let inString = false;
  let current = "";
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inString) {
      current += c;
      if (c === "\\") current += src[++i] ?? "";
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (c === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += c;
  }
  parts.push(current);
  return parts;
}

function formatArgs(argSource, scope, line) {
  const parts = splitArgs(argSource);
  if (parts.length === 1 && parts[0].trim() === "") return "";
  const values = parts.map((p) => evaluate(p, scope, line));
  if (values.length === 1) return display(values[0]);
  const [format, ...args] = values;
  if (format.type !== "str") throw new PreviewError("format argument must be a string", line);
  const holes = (format.value.match(/\{\}/g) || []).length;
  if (holes !== args.length) {
    throw new PreviewError(
      `${holes} positional argument${holes === 1 ? "" : "s"} in format string, but ${args.length} ${
        args.length === 1 ? "argument was" : "arguments were"
      } given`,
      line
    );
  }
  let k = 0;
  return format.value.replace(/\{\}/g, () => display(args[k++]));
}

function expectedKind(annotation) {
  if (INT_TYPES.has(annotation)) return "i64";
  if (FLOAT_TYPES.has(annotation)) return "f64";
  if (annotation === "str" || annotation === "bool") return annotation;
  return null;
}

const LET_RE = /^let\s+(mut\s+)?([A-Za-z_]\w*)\s*(?::\s*([A-Za-z_]\w*))?\s*=\s*(.+);$/;
const ASSIGN_RE = /^([A-Za-z_]\w*)\s*([+\-*/%]?)=\s*(.+);$/;
const PRINT_RE = /^(println|print)\s*\((.*)\)\s*;$/;

function toLines(out) {
  if (!out) return [];
  return (out.endsWith("\n") ? out.slice(0, -1) : out).split("\n");
}

/** Run a program. Returns `{ stdout: string[], error: null | { message, line, unsupported } }`. */
export function runPreview(source) {
  let out = "";
  try {
    const { body, firstLine } = extractMain(source);
    const scope = Object.create(null);
    const lines = body.split("\n");
    for (let k = 0; k < lines.length; k++) {
      const text = lines[k].trim();
      const line = firstLine + k;
      if (!text) continue;

      let m = text.match(LET_RE);
      if (m) {
        const [, mut, name, annotation, expr] = m;
        const value = evaluate(expr, scope, line);
        if (annotation) {
          const kind = expectedKind(annotation);
          if (!kind) throw new PreviewError(`the browser preview doesn't support type \`${annotation}\``, line, true);
          if (kind !== value.type) {
            throw new PreviewError(`mismatched types: expected \`${annotation}\`, found \`${value.type}\``, line);
          }
        }
        scope[name] = { value, mutable: Boolean(mut) };
        continue;
      }

      m = text.match(PRINT_RE);
      if (m) {
        out += formatArgs(m[2], scope, line) + (m[1] === "println" ? "\n" : "");
        continue;
      }

      m = text.match(ASSIGN_RE);
      if (m) {
        const [, name, op, expr] = m;
        if (!(name in scope)) throw new PreviewError(`cannot find value \`${name}\` in this scope`, line);
        if (!scope[name].mutable) throw new PreviewError(`cannot assign twice to immutable variable \`${name}\``, line);
        const rhs = evaluate(expr, scope, line);
        const next = op ? binary(op, scope[name].value, rhs, line) : rhs;
        if (next.type !== scope[name].value.type) {
          throw new PreviewError(`mismatched types: expected \`${scope[name].value.type}\`, found \`${next.type}\``, line);
        }
        scope[name].value = next;
        continue;
      }

      throw new PreviewError(`the browser preview doesn't run this line: \`${text}\``, line, true);
    }
  } catch (err) {
    if (err instanceof PreviewError) {
      return { stdout: toLines(out), error: { message: err.message, line: err.line, unsupported: err.unsupported } };
    }
    throw err;
  }
  return { stdout: toLines(out), error: null };
}

/** Re-indent by brace depth (4 spaces), trim trailing space, collapse blank runs. */
export function formatCode(source) {
  const text = source.replace(/\t/g, "    ");
  const lines = text.split("\n");
  const masked = scan(text, true).split("\n");
  let depth = 0;
  const out = lines.map((raw, index) => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    const code = masked[index].trim();
    const opens = (code.match(/[{([]/g) || []).length;
    const closes = (code.match(/[})\]]/g) || []).length;
    const leading = (code.match(/^[})\]]+/) || [""])[0].length;
    const formatted = "    ".repeat(Math.max(depth - leading, 0)) + trimmed;
    depth = Math.max(depth + opens - closes, 0);
    return formatted;
  });
  return out.join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").trimEnd();
}
