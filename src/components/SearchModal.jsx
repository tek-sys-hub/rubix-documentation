import React, { useState, useEffect, useRef } from "react";
import { SEARCH_INDEX } from "../data/docsData";

export function SearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filtered = query.trim() === ""
    ? SEARCH_INDEX.slice(0, 8)
    : SEARCH_INDEX.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.text.toLowerCase().includes(query.toLowerCase()) ||
        item.kind.toLowerCase().includes(query.toLowerCase())
      );

  function handleQueryChange(e) {
    setQuery(e.target.value);
    setSelectedIndex(0);
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectResult(filtered[selectedIndex].section);
        onClose();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="modal-input-row">
          <input
            ref={inputRef}
            type="text"
            className="modal-search-field"
            placeholder="Type to search sections, commands, standard library..."
            value={query}
            onChange={handleQueryChange}
          />
          <button type="button" onClick={onClose} style={{ fontSize: "0.8rem", color: "var(--ink-muted)", border: "1px solid var(--rule-hairline)", padding: "1px 6px" }}>
            Esc
          </button>
        </div>

        <div className="modal-results-scroll">
          {filtered.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--ink-muted)", fontSize: "0.9rem" }}>
              No matches found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={`${item.section}-${idx}`}
                className={`result-item-row ${selectedIndex === idx ? "active" : ""}`}
                onClick={() => {
                  onSelectResult(item.section);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div>
                  <div className="result-primary-title">{item.title}</div>
                  <div className="result-text-preview">{item.text}</div>
                </div>
                <span className="result-kind-badge">{item.kind}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
