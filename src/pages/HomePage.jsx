import React, { useState } from "react";
import heroCubeImg from "../assets/herosection.png";
import { REPO_URL } from "../data/docsData";

const HERO_CODE = `fn main() {
    let message = "Hello, Rubix!";
    println(message);
}`;

export function HomePage({ onNavigate, onCopyNotice }) {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  function handleRunCode() {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
      if (onCopyNotice) {
        onCopyNotice("Program executed successfully");
      }
    }, 280);
  }

  return (
    <div className="home-container">
      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left Text Column */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-icon">▲</span>
              <span className="badge-text">A new systems programming language</span>
            </div>

            <h1 className="hero-logo-heading">
              <span className="logo-white">RUBI</span>
              <span className="logo-red">X</span>
            </h1>

            <h2 className="hero-tagline">Fast. Simple. Powerful.</h2>

            <p className="hero-description">
              Rubix is a modern, high-performance programming language designed for
              developers who want control, speed and simplicity. Build with
              confidence. Ship with ease.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate("getting-started")}
              >
                Get Started <span className="btn-arrow">→</span>
              </button>

              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <svg className="github-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right Visual Art Column */}
          <div className="hero-right">
            <div className="hero-visual-container">
              <div className="cube-ambient-glow" />
              <div className="cube-wireframe-grid" />
              <img
                src={heroCubeImg}
                alt="Rubix 3D Modular Cube"
                className="hero-cube-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4 FEATURE CARDS ================= */}
      <section className="features-section">
        <div className="features-grid">
          {/* Card 1: Blazing Fast */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="feature-title">Blazing Fast</h3>
            <p className="feature-desc">
              Optimized compiler and efficient runtime for top performance.
            </p>
          </div>

          {/* Card 2: Minimal & Clean */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="feature-title">Minimal &amp; Clean</h3>
            <p className="feature-desc">
              Simple syntax, powerful features. No unnecessary complexity.
            </p>
          </div>

          {/* Card 3: Memory Safe */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="feature-title">Memory Safe</h3>
            <p className="feature-desc">
              Built with safety in mind to prevent common programming errors.
            </p>
          </div>

          {/* Card 4: Zero Dependencies */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feature-svg">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <h3 className="feature-title">Zero Dependencies</h3>
            <p className="feature-desc">
              Self-contained toolchain. No runtime or external dependencies.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CODE PREVIEW SECTION ================= */}
      <section className="code-showcase-section">
        <div className="code-showcase-grid">
          {/* Left Text */}
          <div className="showcase-left">
            <h2 className="showcase-title">Small code. Big power.</h2>
            <p className="showcase-subtitle">
              Write clean, efficient and reliable code with Rubix.
            </p>
          </div>

          {/* Right Code Window */}
          <div className="showcase-right">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="terminal-tab">main.rbx</div>
                <button
                  type="button"
                  className="terminal-run-btn"
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  <span className="run-triangle">▶</span> {isRunning ? "Running..." : "Run"}
                </button>
              </div>

              <div className="terminal-body">
                <div className="code-editor-rows">
                  <div className="line-numbers">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                  </div>
                  <pre className="code-content">
                    <code>
                      <span className="token-keyword">fn</span>{" "}
                      <span className="token-function">main</span>() &#123;{"\n"}
                      {"    "}<span className="token-keyword">let</span>{" "}
                      <span className="token-variable">message</span> ={" "}
                      <span className="token-string">"Hello, Rubix!"</span>;{"\n"}
                      {"    "}<span className="token-function">println</span>(
                      <span className="token-variable">message</span>);{"\n"}
                      &#125;
                    </code>
                  </pre>
                </div>

                {hasRun && (
                  <div className="terminal-output-pane">
                    <div className="output-row prompt">
                      <span className="out-dollar">$</span> rubix run
                    </div>
                    <div className="output-row result">Hello, Rubix!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
