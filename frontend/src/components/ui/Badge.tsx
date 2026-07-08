"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export default function Badge({ children, className = "", label }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass glow-border text-xs font-medium text-accent-cyan ${className}`}
    >
      {children}
      {label && <span>{label}</span>}
    </div>
  );
}
