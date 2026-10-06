import React, { useState, useEffect, useRef } from "react";
import { SEARCH_INDEX } from "../data/docsData";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "getting-started", label: "Getting Started" },
  { id: "language", label: "Language" },
  { id: "advanced", label: "Advanced" },
  { id: "standard-library", label: "Standard Library" },
  { id: "cli", label: "CLI & Modules" },
];

function getCategoryIcon(kind) {
  const k = (kind || "").toLowerCase();
  if (k.includes("getting started") || k.includes("doc")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    );
  }
  if (k.includes("language") || k.includes("syntax")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (k.includes("advanced") || k.includes("layers")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  if (k.includes("command") || k.includes("cli")) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    );
  }
  // Standard library / Module / Default
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function highlightMatch(text, query) {
  if (!query || !query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.trim().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={i} className="search-highlight-mark">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchModal({ isOpen, onClose, onSelectResult }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Sync animation mounting and focus
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          try {
            inputRef.current.focus({ preventScroll: true });
          } catch {
            inputRef.current.focus();
          }
        }
      }, 40);
      return () => clearTimeout(timer);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Request close with smooth exit animation
  function handleRequestClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 160);
  }

  // Filter items
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = SEARCH_INDEX.filter((item) => {
    // Category match
    if (activeCategory !== "all") {
      const itemKind = (item.kind || "").toLowerCase();
      if (activeCategory === "getting-started" && !itemKind.includes("getting started")) return false;
      if (activeCategory === "language" && !itemKind.includes("language")) return false;
      if (activeCategory === "advanced" && !itemKind.includes("advanced")) return false;
      if (activeCategory === "standard-library" && !itemKind.includes("standard library")) return false;
      if (activeCategory === "cli" && !itemKind.includes("command") && !itemKind.includes("module")) return false;
    }

    // Text match
    if (!normalizedQuery) return true;
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      (item.text && item.text.toLowerCase().includes(normalizedQuery)) ||
      (item.kind && item.kind.toLowerCase().includes(normalizedQuery))
    );
  }).slice(0, 15);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Auto-scroll active item into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const activeEl = resultsContainerRef.current.querySelector(".result-item-row.active");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].section);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleRequestClose();
    }
  }

  function handleSelect(section) {
    onSelectResult(section);
    onClose();
  }

  if (!shouldRender && !isOpen) return null;

  return (
    <div
      className={`modal-overlay search-popup-overlay ${isClosing ? "modal-exit" : "modal-enter"}`}
      onClick={(e) => {
        // Only close if clicking directly on backdrop
        if (e.target === e.currentTarget) {
          handleRequestClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Search Documentation"
    >
      <div
        className={`modal-dialog-box search-popup-dialog ${isClosing ? "dialog-exit" : "dialog-enter"}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Animated Crimson Glow Edge Accent */}
        <div className="search-popup-top-glow" />

        {/* Search Input Bar */}
        <div className="modal-input-row search-popup-input-row">
          <div className="search-input-icon-wrap" aria-hidden="true">
            <svg
              className="search-input-magnifier"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="search"
            className="modal-search-field search-popup-input"
            placeholder="Search documentation, syntax, standard library..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            aria-autocomplete="list"
          />

          {/* Quick Clear Button */}
          {query.trim().length > 0 && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery("");
                if (inputRef.current) inputRef.current.focus();
              }}
              aria-label="Clear search query"
              title="Clear input"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          {/* Close button: Shows ESC on desktop, ✕ icon on mobile */}
          <button
            type="button"
            className="search-close-action-btn"
            onClick={handleRequestClose}
            aria-label="Close search popup"
            title="Close"
          >
            <span className="close-badge-desktop">ESC</span>
            <span className="close-icon-mobile">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="search-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`search-cat-tab ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Scroll Area */}
        <div className="modal-results-scroll search-results-container" ref={resultsContainerRef}>
          {filtered.length === 0 ? (
            <div className="search-empty-state">
              <div className="search-empty-icon-wrap">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="12" />
                  <circle cx="11" cy="14" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <p className="search-empty-title">No matching documentation found</p>
              <p className="search-empty-subtitle">
                No results for <span className="empty-query-tag">"{query}"</span>
              </p>
              <div className="search-suggestions-box">
                <span className="search-suggestions-label">Popular topics:</span>
                <div className="search-suggestion-pills">
                  {["structs", "functions", "networking", "hello-world", "concurrency"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      className="search-suggestion-pill"
                      onClick={() => setQuery(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={`${item.section}-${item.title}-${idx}`}
                  className={`result-item-row search-result-item ${isSelected ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.section);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="result-item-left">
                    <span className="result-type-icon">{getCategoryIcon(item.kind)}</span>
                    <div className="result-text-body">
                      <div className="result-primary-title">
                        {highlightMatch(item.title, query)}
                      </div>
                      {item.text && (
                        <div className="result-text-preview">
                          {highlightMatch(item.text, query)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="result-item-right">
                    <span className="result-kind-badge">{item.kind}</span>
                    {isSelected && (
                      <span className="result-jump-badge" title="Tap to select">
                        <span>↵</span> Jump
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with keyboard guidance & results counter */}
        <div className="search-popup-footer">
          <div className="search-keys-hint">
            <span className="search-hint-item">
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span className="search-hint-item">
              <kbd>↵</kbd> Select
            </span>
            <span className="search-hint-item">
              <kbd>esc</kbd> Close
            </span>
          </div>
          <div className="search-footer-brand">
            <span className="brand-dot" />
            <span>{filtered.length} {filtered.length === 1 ? "result" : "results"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
