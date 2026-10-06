import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchModal } from "./components/SearchModal";
import { ShareModal, Toast } from "./components/Modals";
import { DocsLayout } from "./pages/DocsLayout";

export function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const raw = window.location.hash.replace(/^#/, "");
    const [route] = raw.split("?");
    return route || "introduction";
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("rubix-theme") || "light";
    } catch {
      return "light";
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [sidebarBackdrop, setSidebarBackdrop] = useState(false);

  // Sync theme attribute to <html> tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("rubix-theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // Handle URL hash changes
  useEffect(() => {
    function onHashChange() {
      const raw = window.location.hash.replace(/^#/, "");
      const [route] = raw.split("?");
      if (route) {
        setCurrentRoute(route);
      } else {
        setCurrentRoute("introduction");
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Update hash when route changes
  function navigateTo(route) {
    const [baseRoute] = route.split("?");
    setCurrentRoute(baseRoute);
    window.location.hash = baseRoute === "introduction" ? "" : `#${baseRoute}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
    setSidebarBackdrop(false);
  }

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function showToast(message) {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2400);
  }

  function toggleMobileMenu() {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    setSidebarBackdrop(newState);
  }

  function openSearch() {
    setIsMobileMenuOpen(false);
    setSidebarBackdrop(false);
    setIsSearchOpen(true);
  }

  return (
    <div className="app-root">
      {sidebarBackdrop && (
        <div
          className="sidebar-backdrop"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setSidebarBackdrop(false);
          }}
          aria-hidden="true"
        />
      )}

      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenSearch={openSearch}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <main className="main-viewport">
        <DocsLayout
          currentSection={currentRoute}
          onSelectSection={navigateTo}
          onCopyNotice={showToast}
          onOpenShare={(code) => {
            setShareCode(code || "");
            setIsShareOpen(true);
          }}
          onOpenSearch={openSearch}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => {
            setIsMobileMenuOpen(false);
            setSidebarBackdrop(false);
          }}
        />
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(section) => navigateTo(section)}
      />

      <ShareModal
        isOpen={isShareOpen}
        code={shareCode}
        onClose={() => setIsShareOpen(false)}
        onCopy={showToast}
      />

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

export default App;
