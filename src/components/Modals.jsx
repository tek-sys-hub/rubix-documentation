import React from "react";
import { copyText } from "../lib/clipboard";

export function ShareModal({ isOpen, onClose, code, onCopy }) {
  if (!isOpen) return null;

  // Real URL encoding so the shared link actually reproduces the code when opened!
  const shareUrl = `${window.location.origin}${window.location.pathname}#playground?code=${encodeURIComponent(code || "")}`;

  async function handleCopy() {
    const ok = await copyText(shareUrl);
    if (ok && onCopy) onCopy("Permanent playground link copied to clipboard");
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px", padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.85rem" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 400 }}>Share program</h3>
          <button type="button" onClick={onClose} style={{ fontSize: "1.1rem", color: "var(--ink-muted)" }}>✕</button>
        </div>
        <p style={{ fontSize: "0.88rem", color: "var(--ink-secondary)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
          This link includes your current playground code encoded directly into the URL:
        </p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              padding: "0.5rem 0.75rem",
              background: "var(--bg-subtle)",
              border: "1px solid var(--rule-hairline)",
              color: "var(--ink-primary)",
              borderRadius: "2px",
              outline: "none"
            }}
          />
          <button
            type="button"
            onClick={handleCopy}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              background: "var(--ink-primary)",
              color: "#ffffff",
              padding: "0.5rem 0.85rem",
              borderRadius: "2px"
            }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({ message, visible }) {
  if (!visible) return null;
  return (
    <div className="minimal-toast" role="status">
      <span>{message}</span>
    </div>
  );
}
