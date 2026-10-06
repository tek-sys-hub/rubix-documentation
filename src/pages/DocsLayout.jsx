import React, { useState, useEffect } from "react";
import {
  NAV,
  VERSION,
  REPO_URL,
  PRESETS,
  DEFAULT_PRESET,
  EXAMPLES,
  CLI_COMMANDS,
  CLI_FLAGS,
  API_MODULES,
  CHANGELOG,
} from "../data/docsData";
import { CodeBlock } from "../components/CodeBlock";
import { runPreview, formatCode } from "../lib/preview";

export function DocsLayout({
  currentSection = "introduction",
  onSelectSection,
  onCopyNotice,
  onOpenSearch,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) {
  // Playground state
  const [activePresetKey, setActivePresetKey] = useState(DEFAULT_PRESET);
  const [editorCode, setEditorCode] = useState(PRESETS[DEFAULT_PRESET]?.code || "");
  const [playgroundOutput, setPlaygroundOutput] = useState(null);
  const [osTab, setOsTab] = useState("unix");
  const [activeToc, setActiveToc] = useState("overview");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Track scroll position for TOC
  useEffect(() => {
    const handleScroll = () => {
      const headings = [
        { id: "overview", el: document.getElementById("overview") },
        { id: "what-you-learn", el: document.getElementById("what-you-learn") },
        { id: "key-features", el: document.getElementById("key-features") },
        { id: "quick-example", el: document.getElementById("quick-example") },
        { id: "next-steps", el: document.getElementById("next-steps") },
      ];
      const scrollPos = window.scrollY + 120;
      for (let i = headings.length - 1; i >= 0; i--) {
        const item = headings[i];
        if (item.el && item.el.offsetTop <= scrollPos) {
          setActiveToc(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  function scrollToAnchor(id) {
    setActiveToc(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleRunPlayground() {
    const preset = PRESETS[activePresetKey];
    if (preset?.output && editorCode.trim() === preset.code.trim()) {
      setPlaygroundOutput({ stdout: preset.output, error: null });
      return;
    }
    const res = runPreview(editorCode);
    setPlaygroundOutput(res);
  }

  function handleFormatPlayground() {
    const formatted = formatCode(editorCode);
    setEditorCode(formatted);
    if (onCopyNotice) onCopyNotice("Formatted code");
  }

  // Find section title and parent category
  let currentTitle = "Introduction";
  let currentCategory = "Getting Started";

  for (const group of NAV) {
    const item = group.items.find((i) => i.id === currentSection);
    if (item) {
      currentTitle = item.title;
      currentCategory = group.label;
      break;
    }
  }

  // Format category for eyebrow
  const eyebrowText = currentCategory.toUpperCase();

  // Related links for current section
  const getRelatedLinks = () => {
    switch (currentSection) {
      case "introduction":
        return [
          { id: "installation", title: "Installation" },
          { id: "first-program", title: "Your First Program" },
          { id: "project-structure", title: "Project Structure" },
        ];
      case "installation":
        return [
          { id: "first-program", title: "Your First Program" },
          { id: "project-structure", title: "Project Structure" },
          { id: "hello-world", title: "Hello World" },
        ];
      case "first-program":
      case "hello-world":
        return [
          { id: "variables", title: "Variables" },
          { id: "data-types", title: "Data Types" },
          { id: "control-flow", title: "Control Flow" },
        ];
      default:
        return [
          { id: "installation", title: "Installation" },
          { id: "first-program", title: "Your First Program" },
          { id: "project-structure", title: "Project Structure" },
        ];
    }
  };

  const relatedLinks = getRelatedLinks();

  return (
    <div className="docs-page-container">
      <div className="docs-layout-grid">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className={`docs-sidebar ${isMobileMenuOpen ? "mobile-visible" : ""}`}>
          <div className="sidebar-mobile-top">
            {/* Top Brand Block in Sidebar matching rubixui2.png */}
            <div className="sidebar-brand-block" onClick={() => {
              onSelectSection("introduction");
              if (onCloseMobileMenu) onCloseMobileMenu();
            }}>
              <div className="sidebar-brand-icon">
                <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                  <path d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z" fill="#DC2626" />
                  <path d="M16 2L29 9.5L16 16.5L3 9.5L16 2Z" fill="#EF4444" />
                  <path d="M16 16.5L29 9.5V22.5L16 30V16.5Z" fill="#B91C1C" />
                  <path d="M16 16.5V30L3 22.5V9.5L16 16.5Z" fill="#DC2626" />
                  <path d="M16 2V16.5M16 16.5L29 9.5M16 16.5L3 9.5M16 16.5V30" stroke="#FFFFFF" strokeWidth="1.2" />
                  <path d="M16 12L20.5 14.5V19.5L16 22L11.5 19.5V14.5L16 12Z" fill="#FFFFFF" fillOpacity="0.3" stroke="#FFFFFF" strokeWidth="1" />
                </svg>
              </div>
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-name">RUBIX</span>
                <span className="sidebar-brand-ver">v{VERSION}</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={onCloseMobileMenu}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Dedicated Search Bar inside Mobile Drawer */}
          {onOpenSearch && (
            <div className="sidebar-mobile-search-box">
              <button
                type="button"
                className="sidebar-mobile-search-btn"
                onClick={() => {
                  if (onCloseMobileMenu) onCloseMobileMenu();
                  onOpenSearch();
                }}
              >
                <div className="search-pill-inner">
                  <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search documentation...</span>
                </div>
                <span className="mobile-search-pill-badge">Search</span>
              </button>
            </div>
          )}

          {/* Quick Tab Links on Mobile */}
          <div className="sidebar-mobile-tabs">
            <button
              type="button"
              className={`mobile-tab-pill ${["introduction", "getting-started", "installation", "first-program", "project-structure", "hello-world", "variables", "data-types", "operators", "control-flow", "functions", "arrays", "strings", "error-handling", "structs", "traits", "generics", "concurrency", "memory", "modules", "collections", "filesystem", "networking", "system", "time", "json"].includes(currentSection) ? "active" : ""}`}
              onClick={() => {
                onSelectSection("introduction");
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
            >
              Docs
            </button>
            <button
              type="button"
              className={`mobile-tab-pill ${currentSection === "learn" ? "active" : ""}`}
              onClick={() => {
                onSelectSection("learn");
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
            >
              Learn
            </button>
            <button
              type="button"
              className={`mobile-tab-pill ${currentSection === "playground" ? "active" : ""}`}
              onClick={() => {
                onSelectSection("playground");
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
            >
              Playground
            </button>
            <button
              type="button"
              className={`mobile-tab-pill ${currentSection === "packages" ? "active" : ""}`}
              onClick={() => {
                onSelectSection("packages");
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
            >
              Packages
            </button>
            <button
              type="button"
              className={`mobile-tab-pill ${currentSection === "compiler" ? "active" : ""}`}
              onClick={() => {
                onSelectSection("compiler");
                if (onCloseMobileMenu) onCloseMobileMenu();
              }}
            >
              Compiler
            </button>
          </div>

          {/* Categorized Navigation matching rubixui2.png */}
          <nav className="sidebar-nav">
            {NAV.map((group) => (
              <div key={group.id} className="sidebar-group">
                <div className="sidebar-group-header">
                  <div className="sidebar-group-title-wrap">
                    {/* Category Icon */}
                    {group.id === "getting-started" && (
                      <svg className="group-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    )}
                    {group.id === "language" && (
                      <svg className="group-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    )}
                    {group.id === "advanced" && (
                      <svg className="group-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    )}
                    {group.id === "standard-library" && (
                      <svg className="group-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                    )}
                    <span className="sidebar-group-label">{group.label}</span>
                  </div>
                  <svg className="sidebar-group-chevron" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                <div className="sidebar-group-items">
                  {group.items.map((item) => {
                    const isActive = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                        onClick={() => {
                          onSelectSection(item.id);
                          if (onCloseMobileMenu) onCloseMobileMenu();
                        }}
                      >
                        {isActive && <span className="active-item-bar" />}
                        <span className="sidebar-item-label">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* ================= CENTER MAIN ARTICLE ================= */}
        <main className="docs-main-article">
          {/* Breadcrumbs matching rubixui2.png */}
          <div className="docs-breadcrumbs">
            <span
              className="breadcrumb-link"
              onClick={() => onSelectSection("introduction")}
            >
              Docs
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-link">
              {currentCategory.replace("GETTING STARTED", "Getting Started").replace("STANDARD LIBRARY", "Standard Library").replace("LANGUAGE", "Language").replace("ADVANCED", "Advanced")}
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{currentTitle}</span>
          </div>

          {/* Mobile Table of Contents Accordion Bar */}
          <div className="mobile-toc-bar">
            <button
              type="button"
              className="mobile-toc-trigger"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              aria-expanded={mobileTocOpen}
            >
              <div className="mobile-toc-label-wrap">
                <span className="mobile-toc-tag">On this page</span>
                <span className="mobile-toc-title">
                  {activeToc === "overview"
                    ? "Overview"
                    : activeToc === "what-you-learn"
                    ? "What You'll Learn"
                    : activeToc === "key-features"
                    ? "Key Features"
                    : activeToc === "quick-example"
                    ? "Quick Example"
                    : activeToc === "next-steps"
                    ? "Next Steps"
                    : "Overview"}
                </span>
              </div>
              <svg
                className={`mobile-toc-chevron ${mobileTocOpen ? "open" : ""}`}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {mobileTocOpen && (
              <div className="mobile-toc-dropdown">
                <div className="mobile-toc-subheading">SECTIONS</div>
                <ul className="mobile-toc-list">
                  <li>
                    <button
                      type="button"
                      className={`mobile-toc-link ${activeToc === "overview" ? "active" : ""}`}
                      onClick={() => {
                        scrollToAnchor("overview");
                        setMobileTocOpen(false);
                      }}
                    >
                      Overview
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`mobile-toc-link ${activeToc === "what-you-learn" ? "active" : ""}`}
                      onClick={() => {
                        scrollToAnchor("what-you-learn");
                        setMobileTocOpen(false);
                      }}
                    >
                      What You'll Learn
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`mobile-toc-link ${activeToc === "key-features" ? "active" : ""}`}
                      onClick={() => {
                        scrollToAnchor("key-features");
                        setMobileTocOpen(false);
                      }}
                    >
                      Key Features
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`mobile-toc-link ${activeToc === "quick-example" ? "active" : ""}`}
                      onClick={() => {
                        scrollToAnchor("quick-example");
                        setMobileTocOpen(false);
                      }}
                    >
                      Quick Example
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`mobile-toc-link ${activeToc === "next-steps" ? "active" : ""}`}
                      onClick={() => {
                        scrollToAnchor("next-steps");
                        setMobileTocOpen(false);
                      }}
                    >
                      Next Steps
                    </button>
                  </li>
                </ul>

                <div className="mobile-toc-divider" />
                <div className="mobile-toc-subheading">RELATED</div>
                <ul className="mobile-toc-list">
                  {relatedLinks.map((rel) => (
                    <li key={rel.id}>
                      <button
                        type="button"
                        className="mobile-toc-related-link"
                        onClick={() => {
                          onSelectSection(rel.id);
                          setMobileTocOpen(false);
                        }}
                      >
                        <span>{rel.title}</span>
                        <span>↗</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section Category Eyebrow matching rubixui2.png */}
          <div className="section-eyebrow">{eyebrowText}</div>

          {/* Page Heading */}
          <h1 className="docs-main-title">{currentTitle}</h1>

          {/* ================= INTRODUCTION PAGE (EXACTLY MATCHING rubixui2.png) ================= */}
          {(currentSection === "introduction" || currentSection === "getting-started") && (
            <div className="intro-page-body" id="overview">
              {/* Split Hero Section */}
              <div className="intro-hero-split">
                <div className="intro-hero-left">
                  <h2 className="intro-tagline">
                    Build fast.<br />
                    Think clearly.<br />
                    Ship with Rubix.
                  </h2>
                  <p className="intro-lead-text">
                    Rubix is a modern systems programming language designed for performance,
                    simplicity, and control. It combines the power of low-level programming with
                    a clean, approachable syntax and an excellent developer experience.
                  </p>
                  <div className="intro-hero-actions">
                    <button
                      type="button"
                      className="btn-hero-primary"
                      onClick={() => onSelectSection("installation")}
                    >
                      Get Started <span className="btn-arrow">→</span>
                    </button>
                    <a
                      href={REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hero-secondary"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      View on GitHub
                    </a>
                  </div>
                </div>

                <div className="intro-hero-right">
                  <div className="intro-hero-cube-wrap">
                    <img
                      src="/rubix-hero-cube-clean.png"
                      alt="Rubix Isometric Cube Architecture"
                      className="intro-hero-cube-img"
                    />
                  </div>
                </div>
              </div>

              {/* 6 Feature Cards Row matching rubixui2.png */}
              <div className="features-row-grid">
                {/* 1. Fast */}
                <div className="feature-grid-card">
                  <div className="feature-icon red-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h3 className="feature-name">Fast</h3>
                  <p className="feature-description">
                    Native compilation for high performance.
                  </p>
                </div>

                {/* 2. Strong Typing */}
                <div className="feature-grid-card">
                  <div className="feature-icon red-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="feature-name">Strong Typing</h3>
                  <p className="feature-description">
                    Catch errors at compile time.
                  </p>
                </div>

                {/* 3. Simple Syntax */}
                <div className="feature-grid-card">
                  <div className="feature-icon red-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </div>
                  <h3 className="feature-name">Simple Syntax</h3>
                  <p className="feature-description">
                    Clean and expressive.
                  </p>
                </div>

                {/* 4. Low-level Control */}
                <div className="feature-grid-card">
                  <div className="feature-icon red-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </div>
                  <h3 className="feature-name">Low-level Control</h3>
                  <p className="feature-description">
                    Direct access to system resources.
                  </p>
                </div>

                {/* 5. Great Tooling */}
                <div className="feature-grid-card">
                  <div className="feature-icon red-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <h3 className="feature-name">Great Tooling</h3>
                  <p className="feature-description">
                    Compiler, build tool and more.
                  </p>
                </div>

                {/* 6. .bix */}
                <div className="feature-grid-card">
                  <div className="feature-icon red-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <h3 className="feature-name">.bix</h3>
                  <p className="feature-description">
                    A modern file extension.
                  </p>
                </div>
              </div>

              {/* Section: What You'll Learn matching rubixui2.png */}
              <section className="doc-content-section" id="what-you-learn">
                <h2 className="section-subtitle">What You'll Learn</h2>
                <p className="section-body-text">
                  This documentation will guide you through everything you need to get started
                  with Rubix, from installation to advanced topics.
                </p>

                {/* Code Block matching rubixui2.png: hello.bix */}
                <div className="intro-code-sample">
                  <CodeBlock
                    filename="hello.bix"
                    lang="rubix"
                    showLineNumbers={true}
                    code={`fn main() {\n    println!("Hello, Rubix!");\n}`}
                    onCopyNotice={onCopyNotice}
                  />
                </div>
              </section>

              {/* Section: Key Features */}
              <section className="doc-content-section" id="key-features">
                <h2 className="section-subtitle">Key Features</h2>
                <div className="feature-deep-grid">
                  <div className="deep-card">
                    <h4 className="deep-card-title">Memory Safety Without Garbage Collection</h4>
                    <p className="deep-card-text">
                      Rubix provides compile-time ownership semantics and static lifetime tracking,
                      ensuring zero memory leaks, buffer overflows, or data races without runtime pauses.
                    </p>
                  </div>
                  <div className="deep-card">
                    <h4 className="deep-card-title">First-Class Lightweight Concurrency</h4>
                    <p className="deep-card-text">
                      Spawn hundreds of thousands of green tasks communicating over typed channels.
                      Built-in async/await runtime provides top-tier I/O throughput.
                    </p>
                  </div>
                  <div className="deep-card">
                    <h4 className="deep-card-title">Expressive Type System</h4>
                    <p className="deep-card-text">
                      Algebraic data types, structural pattern matching, powerful generics, and traits
                      let you write expressive, maintainable software with confidence.
                    </p>
                  </div>
                  <div className="deep-card">
                    <h4 className="deep-card-title">Native C / C++ Interoperability</h4>
                    <p className="deep-card-text">
                      Directly import and link with existing C libraries without heavy bindings or overhead.
                      Share structs, pointers, and call ABIs natively.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section: Quick Example with live playground */}
              <section className="doc-content-section" id="quick-example">
                <h2 className="section-subtitle">Quick Example</h2>
                <p className="section-body-text">
                  Explore how clean and concise Rubix syntax is. You can run and tweak this code right now:
                </p>

                <div className="interactive-sample-box">
                  <div className="sample-editor-header">
                    <span className="sample-title">fibonacci.bix</span>
                    <button
                      type="button"
                      className="btn-sample-run"
                      onClick={handleRunPlayground}
                    >
                      ▶ Run Program
                    </button>
                  </div>
                  <CodeBlock
                    filename="fibonacci.bix"
                    lang="rubix"
                    showLineNumbers={true}
                    code={`fn fib(n: i64) -> i64 {
    if n <= 1 {
        return n;
    }
    fib(n - 1) + fib(n - 2)
}

fn main() {
    let n = 10;
    println!("fib({}) = {}", n, fib(n));
}`}
                    onCopyNotice={onCopyNotice}
                  />

                  {playgroundOutput && (
                    <div className="sample-output-terminal">
                      <div className="terminal-header">Terminal Output</div>
                      <pre className="terminal-stdout">
                        {Array.isArray(playgroundOutput.stdout)
                          ? playgroundOutput.stdout.join("\n")
                          : playgroundOutput.stdout || "Program executed with return code 0"}
                      </pre>
                    </div>
                  )}
                </div>
              </section>

              {/* Section: Next Steps */}
              <section className="doc-content-section" id="next-steps">
                <h2 className="section-subtitle">Next Steps</h2>
                <div className="next-steps-grid">
                  <div
                    className="next-card"
                    onClick={() => onSelectSection("installation")}
                  >
                    <span className="next-badge">Step 1</span>
                    <h4 className="next-title">Installation</h4>
                    <p className="next-desc">Get the Rubix toolchain running on macOS, Linux, or Windows.</p>
                    <span className="next-link-text">Read Installation →</span>
                  </div>

                  <div
                    className="next-card"
                    onClick={() => onSelectSection("first-program")}
                  >
                    <span className="next-badge">Step 2</span>
                    <h4 className="next-title">Your First Program</h4>
                    <p className="next-desc">Set up your workspace, write your initial program, and run it.</p>
                    <span className="next-link-text">Get Started →</span>
                  </div>

                  <div
                    className="next-card"
                    onClick={() => onSelectSection("project-structure")}
                  >
                    <span className="next-badge">Step 3</span>
                    <h4 className="next-title">Project Structure</h4>
                    <p className="next-desc">Understand packages, modules, rubix.toml, and build targets.</p>
                    <span className="next-link-text">Explore Structure →</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ================= INSTALLATION PAGE ================= */}
          {currentSection === "installation" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                The Rubix toolchain includes the compiler (<code>rubix</code>), the package manager,
                and the standard library. Pre-built binaries are available for Linux, macOS, and Windows.
              </p>

              <div className="guide-step-block">
                <h2 className="step-title" id="toolchain">1. Install the toolchain</h2>
                <p className="step-desc">Select your operating system to see the recommended install instructions.</p>

                <div className="platform-tab-strip">
                  <button
                    type="button"
                    className={`platform-tab ${osTab === "unix" ? "active" : ""}`}
                    onClick={() => setOsTab("unix")}
                  >
                    Linux / macOS
                  </button>
                  <button
                    type="button"
                    className={`platform-tab ${osTab === "win" ? "active" : ""}`}
                    onClick={() => setOsTab("win")}
                  >
                    Windows
                  </button>
                  <button
                    type="button"
                    className={`platform-tab ${osTab === "source" ? "active" : ""}`}
                    onClick={() => setOsTab("source")}
                  >
                    From Source
                  </button>
                </div>

                {osTab === "unix" && (
                  <CodeBlock
                    filename="terminal"
                    lang="shell"
                    code={`# Recommended installer (downloads latest stable release)
curl -fsSL https://rubix-lang.dev/install.sh | sh

# Or install via Homebrew (macOS & Linux)
brew install rubix-lang/tap/rubix`}
                    onCopyNotice={onCopyNotice}
                  />
                )}

                {osTab === "win" && (
                  <CodeBlock
                    filename="PowerShell"
                    lang="powershell"
                    code={`# PowerShell installation script
irm https://rubix-lang.dev/install.ps1 | iex

# Or via Windows Package Manager (winget)
winget install rubix-lang.rubix`}
                    onCopyNotice={onCopyNotice}
                  />
                )}

                {osTab === "source" && (
                  <CodeBlock
                    filename="terminal"
                    lang="shell"
                    code={`# Build from source using git and make
git clone https://github.com/rubix-lang/rubix.git
cd rubix
cargo build --release
sudo cp target/release/rubix /usr/local/bin/`}
                    onCopyNotice={onCopyNotice}
                  />
                )}
              </div>

              <div className="guide-step-block">
                <h2 className="step-title">2. Verify Installation</h2>
                <p className="step-desc">Check that the Rubix compiler is correctly installed and accessible in your PATH:</p>
                <CodeBlock
                  filename="terminal"
                  lang="shell"
                  code={`rubix --version
# Output: rubix 0.1.0 (release, 2026-04-10)`}
                  onCopyNotice={onCopyNotice}
                />
              </div>

              <div className="guide-step-block">
                <h2 className="step-title">3. Next Steps</h2>
                <p className="step-desc">
                  Now that you have the compiler installed, proceed to write your first program:
                </p>
                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={() => onSelectSection("first-program")}
                >
                  Write Your First Program →
                </button>
              </div>
            </div>
          )}

          {/* ================= YOUR FIRST PROGRAM ================= */}
          {currentSection === "first-program" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Let's create a brand new Rubix project, write your first executable, and compile it.
              </p>

              <div className="guide-step-block">
                <h2 className="step-title">1. Create a New Project</h2>
                <p className="step-desc">Use the <code>rubix new</code> command to initialize a new project workspace:</p>
                <CodeBlock
                  filename="terminal"
                  lang="shell"
                  code={`rubix new hello-world
cd hello-world`}
                  onCopyNotice={onCopyNotice}
                />
              </div>

              <div className="guide-step-block">
                <h2 className="step-title">2. The Generated Source</h2>
                <p className="step-desc">Inspect <code>src/main.bix</code>. It contains the standard entry point function:</p>
                <CodeBlock
                  filename="src/main.bix"
                  lang="rubix"
                  showLineNumbers={true}
                  code={`fn main() {
    println!("Hello, World!");
}`}
                  onCopyNotice={onCopyNotice}
                />
              </div>

              <div className="guide-step-block">
                <h2 className="step-title">3. Build & Run</h2>
                <p className="step-desc">Execute your program with a single command:</p>
                <CodeBlock
                  filename="terminal"
                  lang="shell"
                  code={`rubix run
# Output:
# Compiling hello-world v0.1.0
# Running target/debug/hello-world
# Hello, World!`}
                  onCopyNotice={onCopyNotice}
                />
              </div>
            </div>
          )}

          {/* ================= PROJECT STRUCTURE ================= */}
          {currentSection === "project-structure" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Rubix projects follow a clean, standardized directory convention.
              </p>

              <div className="guide-step-block">
                <h2 className="step-title">Directory Layout</h2>
                <CodeBlock
                  filename="directory-tree"
                  lang="shell"
                  code={`my-project/
├── rubix.toml        # Project manifest, dependencies & metadata
├── rubix.lock        # Exact pinned dependency lockfile
├── src/
│   ├── main.bix      # Binary application entry point
│   └── lib.bix       # Library root (optional)
└── target/           # Compiled artifacts and build cache`}
                  onCopyNotice={onCopyNotice}
                />
              </div>

              <div className="guide-step-block">
                <h2 className="step-title">Configuration File (rubix.toml)</h2>
                <p className="step-desc">The manifest defines project metadata, compiler optimization flags, and package dependencies:</p>
                <CodeBlock
                  filename="rubix.toml"
                  lang="toml"
                  code={`[package]
name = "my-project"
version = "0.1.0"
authors = ["Your Name <you@example.com>"]
edition = "2026"

[dependencies]
rubix-http = "1.2.0"
rubix-json = "0.9.1"`}
                  onCopyNotice={onCopyNotice}
                />
              </div>
            </div>
          )}

          {/* ================= HELLO WORLD ================= */}
          {currentSection === "hello-world" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                A thorough breakdown of the canonical "Hello, World!" application in Rubix.
              </p>

              <CodeBlock
                filename="hello.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn main() {
    println!("Hello, Rubix!");
}`}
                onCopyNotice={onCopyNotice}
              />

              <div className="guide-step-block">
                <h2 className="step-title">Key Concepts</h2>
                <ul className="docs-bullets">
                  <li><strong><code>fn main()</code></strong>: The mandatory entry point for every standalone executable program.</li>
                  <li><strong><code>println!</code></strong>: Built-in macro that formats and writes output to standard output followed by a newline.</li>
                  <li><strong><code>.bix</code> extension</strong>: Standard source file extension for the Rubix language.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ================= VARIABLES ================= */}
          {currentSection === "variables" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Variables in Rubix are immutable by default to eliminate unexpected state mutations.
              </p>

              <CodeBlock
                filename="variables.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn main() {
    // Immutable by default
    let count = 42;
    
    // Explicit mutability with 'mut'
    let mut score = 100;
    score = score + 25;

    // Type annotations are optional due to type inference
    let port: u16 = 8080;

    println!("Count: {}, Score: {}, Port: {}", count, score, port);
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= DATA TYPES ================= */}
          {currentSection === "data-types" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Rubix is statically typed with robust integer primitives, IEEE-754 floats, booleans, and compound types.
              </p>

              <CodeBlock
                filename="types.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn main() {
    // Signed integers: i8, i16, i32, i64, isize
    let signed_val: i32 = -1500;

    // Unsigned integers: u8, u16, u32, u64, usize
    let unsigned_val: u64 = 987654321;

    // Floating point: f32, f64
    let pi: f64 = 3.1415926535;

    // Boolean & character
    let is_active: bool = true;
    let symbol: char = 'R';

    println!("pi: {}, active: {}", pi, is_active);
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= OPERATORS ================= */}
          {currentSection === "operators" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Comprehensive support for arithmetic, comparison, logical, bitwise, and assignment operators.
              </p>

              <CodeBlock
                filename="operators.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn main() {
    let a = 15;
    let b = 4;

    println!("Addition: {}", a + b);
    println!("Division: {}", a / b);
    println!("Modulo: {}", a % b);
    println!("Bitwise AND: {}", a & b);
    println!("Logical: {}", (a > 10) && (b < 10));
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= CONTROL FLOW ================= */}
          {currentSection === "control-flow" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Control flow in Rubix includes expressions like <code>if-else</code>, <code>match</code>, and loops.
              </p>

              <CodeBlock
                filename="control_flow.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn main() {
    let score = 88;

    // If expressions evaluate to a value
    let grade = if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else {
        "C"
    };

    println!("Grade: {}", grade);

    // For loop iteration
    for i in 1..=5 {
        println!("Step {}", i);
    }
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= FUNCTIONS ================= */}
          {currentSection === "functions" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Functions are declared with <code>fn</code>, taking typed parameters and optional return types.
              </p>

              <CodeBlock
                filename="functions.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn add(a: i32, b: i32) -> i32 {
    a + b // Implicit return of final expression
}

fn greet(name: str) {
    println!("Welcome to Rubix, {}!", name);
}

fn main() {
    let sum = add(10, 20);
    println!("Sum is {}", sum);
    greet("Developer");
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= ARRAYS & STRINGS ================= */}
          {(currentSection === "arrays" || currentSection === "strings") && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Fixed-size arrays, slices, and UTF-8 strings in Rubix are designed for zero-copy efficiency.
              </p>

              <CodeBlock
                filename="arrays_strings.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn main() {
    let numbers = [10, 20, 30, 40, 50];
    println!("First element: {}", numbers[0]);
    println!("Array length: {}", numbers.len());

    let message = "Hello from Rubix";
    println!("String length: {}", message.len());
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= ERROR HANDLING ================= */}
          {currentSection === "error-handling" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Rubix replaces exceptions with explicit <code>Result&lt;T, E&gt;</code> and <code>Option&lt;T&gt;</code> types.
              </p>

              <CodeBlock
                filename="error_handling.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`fn divide(a: f64, b: f64) -> Result<f64, str> {
    if b == 0.0 {
        return Err("Division by zero");
    }
    Ok(a / b)
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(val) => println!("Result: {}", val),
        Err(err) => println!("Error: {}", err),
    }
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= STRUCTS ================= */}
          {currentSection === "structs" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Structs let you package related values together with associated methods via <code>impl</code> blocks.
              </p>

              <CodeBlock
                filename="structs.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`struct Server {
    host: str,
    port: u16,
}

impl Server {
    fn new(host: str, port: u16) -> Server {
        Server { host, port }
    }

    fn url(&self) -> str {
        format!("http://{}:{}", self.host, self.port)
    }
}

fn main() {
    let s = Server::new("localhost", 8080);
    println!("Running on: {}", s.url());
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= CONCURRENCY ================= */}
          {currentSection === "concurrency" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Rubix includes green threads and message-passing channels for seamless parallel computation.
              </p>

              <CodeBlock
                filename="concurrency.bix"
                lang="rubix"
                showLineNumbers={true}
                code={`import rubix::sync::chan;

fn main() {
    let (tx, rx) = chan::new<str>();

    let tx_clone = tx.clone();
    spawn {
        tx_clone.send("Worker task 1 completed");
    };

    spawn {
        tx.send("Worker task 2 completed");
    };

    println!("{}", rx.recv());
    println!("{}", rx.recv());
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= STANDARD LIBRARY & OTHERS ================= */}
          {["collections", "filesystem", "networking", "system", "time", "json", "traits", "generics", "memory", "modules"].includes(currentSection) && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Detailed API references and standard patterns for <code>{currentTitle}</code>.
              </p>

              <CodeBlock
                filename={`${currentSection}.bix`}
                lang="rubix"
                showLineNumbers={true}
                code={`import rubix::${currentSection};

fn main() {
    println!("Using rubix::{}", "${currentSection}");
    // Standard library functionality
}`}
                onCopyNotice={onCopyNotice}
              />
            </div>
          )}

          {/* ================= PLAYGROUND VIEW ================= */}
          {currentSection === "playground" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Write, modify, and run Rubix code live directly inside your web browser.
              </p>

              <div className="playground-container-box">
                <div className="playground-toolbar">
                  <div className="preset-selector-row">
                    <label className="preset-label">Preset:</label>
                    <select
                      className="preset-dropdown"
                      value={activePresetKey}
                      onChange={(e) => {
                        const key = e.target.value;
                        setActivePresetKey(key);
                        if (PRESETS[key]) {
                          setEditorCode(PRESETS[key].code);
                          setPlaygroundOutput(null);
                        }
                      }}
                    >
                      {Object.entries(PRESETS).map(([key, data]) => (
                        <option key={key} value={key}>
                          {data.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="playground-btn-group">
                    <button
                      type="button"
                      className="btn-toolbar-format"
                      onClick={handleFormatPlayground}
                    >
                      Format
                    </button>
                    <button
                      type="button"
                      className="btn-toolbar-run"
                      onClick={handleRunPlayground}
                    >
                      ▶ Run Code
                    </button>
                  </div>
                </div>

                <div className="playground-editor-area">
                  <textarea
                    className="playground-textarea"
                    value={editorCode}
                    onChange={(e) => setEditorCode(e.target.value)}
                    spellCheck="false"
                  />
                </div>

                <div className="playground-output-area">
                  <div className="terminal-header">Execution Output</div>
                  <pre className="terminal-stdout">
                    {playgroundOutput
                      ? Array.isArray(playgroundOutput.stdout)
                        ? playgroundOutput.stdout.join("\n")
                        : playgroundOutput.stdout || "Execution finished with no output."
                      : "Click 'Run Code' to compile and execute in the browser preview."}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ================= COMPILER VIEW ================= */}
          {currentSection === "compiler" && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                The Rubix compilation pipeline transforms high-level source code into optimized machine code.
              </p>

              <div className="guide-step-block">
                <h2 className="step-title">Command Line Interface</h2>
                <div className="cli-table-wrap">
                  <table className="cli-table">
                    <thead>
                      <tr>
                        <th>Command</th>
                        <th>Description</th>
                        <th>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CLI_COMMANDS.map((item) => (
                        <tr key={item.cmd}>
                          <td><code>{item.cmd}</code></td>
                          <td>{item.desc}</td>
                          <td><code>{item.example}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= PACKAGES / LEARN ================= */}
          {(currentSection === "packages" || currentSection === "learn") && (
            <div className="doc-section-content" id="overview">
              <p className="docs-lead-paragraph">
                Welcome to the Rubix {currentSection === "packages" ? "Package Registry" : "Interactive Learning Guide"}.
              </p>
              <div className="next-steps-grid">
                <div className="next-card" onClick={() => onSelectSection("installation")}>
                  <h4 className="next-title">Get Started</h4>
                  <p className="next-desc">Read the quick-start documentation to begin developing.</p>
                </div>
                <div className="next-card" onClick={() => onSelectSection("playground")}>
                  <h4 className="next-title">Interactive Playground</h4>
                  <p className="next-desc">Experiment with Rubix code directly in the browser.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ================= RIGHT SIDEBAR ("ON THIS PAGE") ================= */}
        <aside className="docs-right-toc">
          <div className="toc-container-sticky">
            <div className="toc-header">ON THIS PAGE</div>
            <ul className="toc-list">
              <li>
                <button
                  type="button"
                  className={`toc-item-link ${activeToc === "overview" ? "active" : ""}`}
                  onClick={() => scrollToAnchor("overview")}
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`toc-item-link ${activeToc === "what-you-learn" ? "active" : ""}`}
                  onClick={() => scrollToAnchor("what-you-learn")}
                >
                  What You'll Learn
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`toc-item-link ${activeToc === "key-features" ? "active" : ""}`}
                  onClick={() => scrollToAnchor("key-features")}
                >
                  Key Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`toc-item-link ${activeToc === "quick-example" ? "active" : ""}`}
                  onClick={() => scrollToAnchor("quick-example")}
                >
                  Quick Example
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`toc-item-link ${activeToc === "next-steps" ? "active" : ""}`}
                  onClick={() => scrollToAnchor("next-steps")}
                >
                  Next Steps
                </button>
              </li>
            </ul>

            <div className="toc-divider" />

            <div className="toc-header">RELATED</div>
            <ul className="toc-list related-list">
              {relatedLinks.map((rel) => (
                <li key={rel.id}>
                  <button
                    type="button"
                    className="toc-related-link"
                    onClick={() => onSelectSection(rel.id)}
                  >
                    <span>{rel.title}</span>
                    <span className="related-arrow">↗</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DocsLayout;
