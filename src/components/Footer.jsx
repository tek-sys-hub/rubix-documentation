import React from "react";
import { VERSION, REPO_URL } from "../data/docsData";

export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-row">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: "18px", height: "18px" }}>
                <path d="M12 2L21 7.2V17.5L12 22.8L3 17.5V7.2L12 2Z" stroke="#C93B27" strokeWidth="1.8"/>
                <path d="M12 2V12.5M12 12.5L21 7.2M12 12.5L3 7.2M12 12.5V22.8" stroke="#C93B27" strokeWidth="1.5"/>
              </svg>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>RUBIX</span>
            </div>
            <p className="footer-manifesto">
              Rubix is an open systems programming language focused on predictable performance, zero-cost memory safety, and a straightforward syntax.
            </p>
          </div>

          <div className="footer-nav-grid">
            <div className="footer-group-col">
              <h5>Guide</h5>
              <ul>
                <li><button type="button" onClick={() => onNavigate("getting-started")}>Getting started</button></li>
                <li><button type="button" onClick={() => onNavigate("installation")}>Installation</button></li>
                <li><button type="button" onClick={() => onNavigate("language-tour")}>Language tour</button></li>
                <li><button type="button" onClick={() => onNavigate("syntax")}>Syntax &amp; types</button></li>
              </ul>
            </div>

            <div className="footer-group-col">
              <h5>Reference</h5>
              <ul>
                <li><button type="button" onClick={() => onNavigate("cli-reference")}>Command line</button></li>
                <li><button type="button" onClick={() => onNavigate("api-reference")}>Standard library</button></li>
                <li><button type="button" onClick={() => onNavigate("benchmarks")}>Benchmarks</button></li>
                <li><button type="button" onClick={() => onNavigate("changelog")}>Changelog</button></li>
              </ul>
            </div>

            <div className="footer-group-col">
              <h5>Ecosystem</h5>
              <ul>
                <li><button type="button" onClick={() => onNavigate("playground")}>Playground</button></li>
                <li><button type="button" onClick={() => onNavigate("examples")}>Examples</button></li>
                <li><button type="button" onClick={() => onNavigate("migration-guide")}>Migration guide</button></li>
                <li><a href={REPO_URL} target="_blank" rel="noopener noreferrer">Source code ↗</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>Rubix version {VERSION} • Released under the MIT License</span>
          <span>Documentation rendered for offline and print readability</span>
        </div>
      </div>
    </footer>
  );
}
