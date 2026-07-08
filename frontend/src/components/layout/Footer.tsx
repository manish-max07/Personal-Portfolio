"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-dark-navy/60 backdrop-blur-md py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary font-[family-name:var(--font-orbitron)] tracking-wider">
        <div className="text-center sm:text-left">
          Copyright Manish Kumar 2026
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#" className="hover:text-accent-cyan transition-colors">Privacy</a>
          <span className="text-white/10">|</span>
          <a href="#" className="hover:text-accent-cyan transition-colors">T&C</a>
          <span className="text-white/10">|</span>
          <span className="text-text-secondary/60">Version 1.0 Stable</span>
        </div>
      </div>
    </footer>
  );
}
