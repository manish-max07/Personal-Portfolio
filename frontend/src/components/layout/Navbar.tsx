"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Circle } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-strong shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo / Monogram */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex items-center gap-2 group"
            >
              <span className="text-2xl font-bold text-accent-cyan neon-cyan tracking-tight font-[family-name:var(--font-orbitron)]">
                MK
              </span>
              <span className="hidden sm:block text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                Manish Kumar
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-2 text-sm text-text-secondary hover:text-accent-cyan transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-accent-cyan group-hover:w-3/4 transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(34,200,255,0.5)]" />
                </a>
              ))}
            </div>

            {/* Right side: status + resume button */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Available status */}
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-status-green opacity-75 animate-ping" />
                  <Circle className="relative h-2 w-2 text-status-green fill-status-green" />
                </span>
                <span className="hidden xl:inline">Available for opportunities</span>
              </div>

              {/* Download Resume */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-accent-cyan glass glow-border glow-border-hover transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Resume
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] glass-strong lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="text-lg font-bold text-accent-cyan neon-cyan font-[family-name:var(--font-orbitron)]">
                  MK
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col p-4 gap-1 flex-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="px-4 py-3 rounded-xl text-text-secondary hover:text-accent-cyan hover:bg-white/5 transition-all duration-300 text-sm"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Mobile footer */}
              <div className="p-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-status-green opacity-75 animate-ping" />
                    <Circle className="relative h-2 w-2 text-status-green fill-status-green" />
                  </span>
                  Available for opportunities
                </div>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-accent-cyan glass glow-border glow-border-hover"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
