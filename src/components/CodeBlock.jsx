import React, { useState } from "react";
import { highlight } from "../lib/highlight";
import { copyText } from "../lib/clipboard";

export function CodeBlock({
  code,
  lang = "rubix",
  filename,
  prompt = true,
  showLineNumbers = true,
  onCopyNotice,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(code);
    if (ok) {
      setCopied(true);
      if (onCopyNotice) onCopyNotice("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // Count lines for line numbers
  const lines = code.trim().split("\n");

  return (
    <div className="code-block-container">
      {(filename || lang) && (
        <div className="code-block-header">
          <div className="code-block-header-left">
            {/* Red Rubix Cube Icon matching rubixui2.png */}
            <svg
              className="code-cube-icon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                fill="#DC2626"
                stroke="#B91C1C"
                strokeWidth="1.2"
              />
              <path
                d="M12 2L21 7L12 12L3 7L12 2Z"
                fill="#EF4444"
              />
              <path
                d="M12 12V22M12 12L21 7M12 12L3 7"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="code-block-title">{filename || lang}</span>
          </div>

          <button
            type="button"
            className="copy-btn-minimal"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: "#16A34A", fontWeight: 600 }}>Copied</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="code-block-body">
        {showLineNumbers && lines.length > 0 && (
          <div className="code-line-numbers" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i} className="line-num">
                {i + 1}
              </span>
            ))}
          </div>
        )}
        <pre className="code-block-pre">
          <code>{highlight(code, lang, { prompt })}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
