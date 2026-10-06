import React, { useState } from "react";
import { VERSION, REPO_URL } from "../data/docsData";

export function Header({
  currentRoute,
  onNavigate,
  onOpenSearch,
  theme = "light",
  onToggleTheme,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) {
  const isDocs = [
    "introduction",
    "getting-started",
    "installation",
    "first-program",
    "project-structure",
    "hello-world",
    "variables",
    "data-types",
    "operators",
    "control-flow",
    "functions",
    "arrays",
    "strings",
    "error-handling",
    "structs",
    "traits",
    "generics",
    "concurrency",
    "memory",
    "modules",
    "collections",
    "filesystem",
    "networking",
    "system",
    "time",
    "json",
  ].includes(currentRoute) || currentRoute === "docs" || !currentRoute;

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Left Side: Brand Logo and Main Nav */}
        <div className="header-left">
          <button
            type="button"
            className="brand-logo-btn"
            onClick={() => onNavigate("introduction")}
            aria-label="Rubix Home"
          >
            {/* Rubix Red Isometric Cube Icon */}
            <svg
              className="brand-cube-icon"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer isometric hexagon */}
              <path
                d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z"
                fill="#DC2626"
              />
              {/* Top Face highlight */}
              <path
                d="M16 2L29 9.5L16 16.5L3 9.5L16 2Z"
                fill="#EF4444"
              />
              {/* Right Face medium shade */}
              <path
                d="M16 16.5L29 9.5V22.5L16 30V16.5Z"
                fill="#B91C1C"
              />
              {/* Left Face deep shade */}
              <path
                d="M16 16.5V30L3 22.5V9.5L16 16.5Z"
                fill="#DC2626"
              />
              {/* Interior geometric cut lines */}
              <path
                d="M16 2V16.5M16 16.5L29 9.5M16 16.5L3 9.5M16 16.5V30"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Center inset floating cube element */}
              <path
                d="M16 12L20.5 14.5V19.5L16 22L11.5 19.5V14.5L16 12Z"
                fill="#FFFFFF"
                fillOpacity="0.25"
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            </svg>
            <span className="brand-logo-text">RUBIX</span>
          </button>

          {/* Navigation links matching rubixui2.png: Docs, Learn, Playground, Packages, Compiler */}
          <nav className="header-nav-links">
            <button
              type="button"
              className={`nav-tab-item ${isDocs ? "active" : ""}`}
              onClick={() => onNavigate("introduction")}
            >
              Docs
              {isDocs && <span className="active-glow-bar" />}
            </button>

            <button
              type="button"
              className={`nav-tab-item ${currentRoute === "learn" ? "active" : ""}`}
              onClick={() => onNavigate("learn")}
            >
              Learn
              {currentRoute === "learn" && <span className="active-glow-bar" />}
            </button>

            <button
              type="button"
              className={`nav-tab-item ${currentRoute === "playground" ? "active" : ""}`}
              onClick={() => onNavigate("playground")}
            >
              Playground
              {currentRoute === "playground" && <span className="active-glow-bar" />}
            </button>

            <button
              type="button"
              className={`nav-tab-item ${currentRoute === "packages" ? "active" : ""}`}
              onClick={() => onNavigate("packages")}
            >
              Packages
              {currentRoute === "packages" && <span className="active-glow-bar" />}
            </button>

            <button
              type="button"
              className={`nav-tab-item ${currentRoute === "compiler" ? "active" : ""}`}
              onClick={() => onNavigate("compiler")}
            >
              Compiler
              {currentRoute === "compiler" && <span className="active-glow-bar" />}
            </button>
          </nav>
        </div>

        {/* Right Side: Search Box + GitHub Icon + Theme Toggle */}
        <div className="header-right">
          {/* Search Button styled as input field with Ctrl K badge */}
          <button
            type="button"
            className="search-input-pill"
            onClick={onOpenSearch}
            aria-label="Search documentation"
          >
            <div className="search-pill-inner">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="search-placeholder">Search documentation...</span>
            </div>
            <div className="search-keys">
              <kbd className="key-badge">Ctrl K</kbd>
            </div>
          </button>

          {/* GitHub Icon Link matching rubixui2.png */}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-icon-btn github-header-btn"
            aria-label="View Rubix on GitHub"
            title="GitHub Repository"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Theme Toggle Button matching rubixui2.png sun/sparkle icon */}
          <button
            type="button"
            className="header-icon-btn theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle Color Theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? (
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
