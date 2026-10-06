import { Fragment } from "react";

const KEYWORDS = new Set([
  "fn", "let", "mut", "return", "if", "else", "match", "for", "while", "loop", "in",
  "break", "continue", "struct", "enum", "impl", "import", "pub", "spawn", "as",
  "const", "extern", "true", "false", "self",
]);

const PRIMITIVES = new Set([
  "i8", "i16", "i32", "i64", "isize", "u8", "u16", "u32", "u64", "usize",
  "f32", "f64", "bool", "char", "str",
]);

// comment | string or char | number | identifier | any other single character
const RUBIX_TOKEN = String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)')|(\b\d[\d_]*(?:\.\d[\d_]*)?(?:_?[iuf](?:8|16|32|64|size))?\b)|([A-Za-z_]\w*)|([\s\S])`;

function push(tokens, kind, text) {
  if (!text) return;
  const last = tokens[tokens.length - 1];
  if (last && last.kind === kind) last.text += text;
  else tokens.push({ kind, text });
}

function rubixTokens(code) {
  const tokens = [];
  const re = new RegExp(RUBIX_TOKEN, "g");
  let m;
  while ((m = re.exec(code)) !== null) {
    const [text, comment, string, number, ident] = m;
    let kind = "plain";
    if (comment) kind = "comment";
    else if (string) kind = "string";
    else if (number) kind = "number";
    else if (ident) {
      if (KEYWORDS.has(ident)) kind = "keyword";
      else if (PRIMITIVES.has(ident) || /^[A-Z]/.test(ident)) kind = "type";
      else if (code[re.lastIndex] === "(") kind = "fn";
    }
    push(tokens, kind, text);
  }
  return tokens;
}

function shellTokens(code, prompt) {
  const tokens = [];
  const lines = code.split("\n");
  lines.forEach((line, index) => {
    const newline = index < lines.length - 1 ? "\n" : "";
    const trimmed = line.trim();
    if (!trimmed) {
      push(tokens, "plain", line + newline);
      return;
    }
    if (trimmed.startsWith("#")) {
      push(tokens, "comment", line);
      push(tokens, "plain", newline);
      return;
    }
    const cut = line.search(/\s#/);
    const body = cut === -1 ? line : line.slice(0, cut);
    const comment = cut === -1 ? "" : line.slice(cut);
    const [, indent, command, rest] = body.match(/^(\s*)(\S+)([\s\S]*)$/);
    push(tokens, "prompt", prompt);
    push(tokens, "plain", indent);
    push(tokens, "command", command);
    push(tokens, "plain", rest);
    push(tokens, "comment", comment);
    push(tokens, "plain", newline);
  });
  return tokens;
}

function tomlTokens(code) {
  const tokens = [];
  const lines = code.split("\n");
  lines.forEach((line, index) => {
    const newline = index < lines.length - 1 ? "\n" : "";
    const trimmed = line.trim();
    const pair = line.match(/^(\s*)([\w.-]+)(\s*=\s*)(.*)$/);
    if (trimmed.startsWith("#")) push(tokens, "comment", line);
    else if (/^\[.*\]$/.test(trimmed)) push(tokens, "type", line);
    else if (pair) {
      const [, indent, key, eq, value] = pair;
      push(tokens, "plain", indent);
      push(tokens, "fn", key);
      push(tokens, "plain", eq);
      push(tokens, /^["']/.test(value) ? "string" : /^\d/.test(value) ? "number" : "plain", value);
    } else push(tokens, "plain", line);
    push(tokens, "plain", newline);
  });
  return tokens;
}

function tokensFor(code, lang, withPrompt) {
  switch (lang) {
    case "rubix":
      return rubixTokens(code);
    case "shell":
      return shellTokens(code, withPrompt ? "$ " : "");
    case "powershell":
      return shellTokens(code, withPrompt ? "PS> " : "");
    case "toml":
      return tomlTokens(code);
    default:
      return [{ kind: "plain", text: code }];
  }
}

/** Returns React nodes with `tok-*` class names for the given language. */
export function highlight(code, lang = "rubix", { prompt = true } = {}) {
  return tokensFor(code, lang, prompt).map((token, i) =>
    token.kind === "plain" ? (
      <Fragment key={i}>{token.text}</Fragment>
    ) : (
      <span key={i} className={`tok-${token.kind}`} aria-hidden={token.kind === "prompt" ? "true" : undefined}>
        {token.text}
      </span>
    )
  );
}
