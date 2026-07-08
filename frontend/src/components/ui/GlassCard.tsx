"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glow = false,
}: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl ${
        glow ? "glow-border glow-border-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
