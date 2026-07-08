"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "solid" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  download?: string | boolean;
}

export default function Button({
  children,
  variant = "solid",
  href,
  onClick,
  className = "",
  icon,
  download,
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer select-none";

  const variants = {
    solid: `bg-accent-cyan text-dark-navy hover:shadow-[0_0_24px_rgba(34,200,255,0.5),0_0_60px_rgba(34,200,255,0.15)] hover:scale-[1.03] active:scale-[0.98]`,
    outline: `glass glow-border glow-border-hover text-accent-cyan hover:text-cyan-glow hover:scale-[1.03] active:scale-[0.98]`,
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} download={download}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
