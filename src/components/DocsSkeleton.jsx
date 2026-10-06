import React from "react";

export function DocsSkeleton() {
  return (
    <div className="docs-skeleton-container" aria-busy="true" aria-label="Loading content">
      {/* Breadcrumb Skeleton */}
      <div className="skeleton-breadcrumbs">
        <div className="skeleton-bar" style={{ width: "60px", height: "14px" }} />
        <span className="skeleton-sep">/</span>
        <div className="skeleton-bar" style={{ width: "90px", height: "14px" }} />
        <span className="skeleton-sep">/</span>
        <div className="skeleton-bar" style={{ width: "110px", height: "14px" }} />
      </div>

      {/* Eyebrow Category Tag */}
      <div className="skeleton-eyebrow">
        <div className="skeleton-bar" style={{ width: "120px", height: "13px" }} />
      </div>

      {/* Main Title Heading */}
      <div className="skeleton-title">
        <div className="skeleton-bar skeleton-title-bar" />
      </div>

      {/* Hero Headline / Tagline */}
      <div className="skeleton-hero-headline">
        <div className="skeleton-bar" style={{ width: "75%", height: "30px", marginBottom: "8px" }} />
        <div className="skeleton-bar" style={{ width: "55%", height: "30px" }} />
      </div>

      {/* Lead Paragraph Text */}
      <div className="skeleton-lead-text">
        <div className="skeleton-bar" style={{ width: "100%", height: "16px", marginBottom: "8px" }} />
        <div className="skeleton-bar" style={{ width: "94%", height: "16px", marginBottom: "8px" }} />
        <div className="skeleton-bar" style={{ width: "70%", height: "16px" }} />
      </div>

      {/* Action Buttons */}
      <div className="skeleton-actions">
        <div className="skeleton-pill" style={{ width: "130px", height: "40px" }} />
        <div className="skeleton-pill" style={{ width: "145px", height: "40px" }} />
      </div>

      {/* Features Grid Skeleton */}
      <div className="skeleton-features-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-feature-card">
            <div className="skeleton-icon-box" />
            <div className="skeleton-bar" style={{ width: "50%", height: "16px", margin: "10px 0 8px 0" }} />
            <div className="skeleton-bar" style={{ width: "85%", height: "12px", marginBottom: "4px" }} />
            <div className="skeleton-bar" style={{ width: "65%", height: "12px" }} />
          </div>
        ))}
      </div>

      {/* Code Block Skeleton */}
      <div className="skeleton-code-block">
        <div className="skeleton-code-header">
          <div className="skeleton-bar" style={{ width: "90px", height: "14px" }} />
          <div className="skeleton-bar" style={{ width: "55px", height: "14px" }} />
        </div>
        <div className="skeleton-code-lines">
          {[
            "45%",
            "70%",
            "85%",
            "60%",
            "35%",
            "90%",
            "50%",
          ].map((w, idx) => (
            <div key={idx} className="skeleton-code-line-row">
              <span className="skeleton-line-num" />
              <div className="skeleton-bar" style={{ width: w, height: "13px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DocsSkeleton;
