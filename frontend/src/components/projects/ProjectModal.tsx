"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { getTechIcon } from "@/lib/techIcons";

/* ── Types ──────────────────────────────────────────────── */
interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
  live_url: string;
  image_urls?: string | null;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const images =
    project?.image_urls
      ?.split(",")
      .map((u) => u.trim())
      .filter(Boolean) ?? [];

  const techTags = project?.tech_stack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean) ?? [];

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImage(0);
  }, [project?.id]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const prevImage = useCallback(() => {
    setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Auto-play / Auto-slide carousel
  useEffect(() => {
    if (!project || images.length <= 1) return;
    const timer = setInterval(() => {
      nextImage();
    }, 4000);
    return () => clearInterval(timer);
  }, [project, images.length, nextImage, currentImage]);

  // Arrow key navigation for carousel
  useEffect(() => {
    if (!project || images.length <= 1) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [project, images.length, prevImage, nextImage]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 320,
              duration: 0.35,
            }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto glass rounded-2xl glow-border shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:shadow-[0_0_12px_rgba(34,200,255,0.3)] transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* ── Carousel ───────────────────────────────── */}
              {images.length > 0 ? (
                <div className="relative w-full aspect-video bg-dark-navy/60 overflow-hidden rounded-t-2xl flex-shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage}
                      src={images[currentImage]}
                      alt={`${project.title} screenshot ${currentImage + 1}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Gradient overlay at bottom for readability */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-dark-navy/60 to-transparent pointer-events-none" />

                  {/* Arrow nav — only if >1 image */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:shadow-[0_0_12px_rgba(34,200,255,0.3)] transition-all duration-300 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:shadow-[0_0_12px_rgba(34,200,255,0.3)] transition-all duration-300 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImage(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={`rounded-full transition-all duration-300 cursor-pointer ${
                              i === currentImage
                                ? "w-4 h-1.5 bg-accent-cyan"
                                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Placeholder when no images */
                <div className="w-full aspect-video bg-gradient-to-br from-deep-blue/40 to-dark-navy/60 rounded-t-2xl flex-shrink-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl glass glow-border flex items-center justify-center mx-auto mb-3">
                      <ExternalLink className="w-7 h-7 text-accent-cyan/40" />
                    </div>
                    <p className="text-xs text-text-secondary/50">No preview available</p>
                  </div>
                </div>
              )}

              {/* ── Content ────────────────────────────────── */}
              <div className="p-5 sm:p-6 flex flex-col gap-4">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug pr-10">
                  {project.title}
                </h2>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-accent-cyan/20 via-accent-cyan/10 to-transparent" />

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {project.description}
                </p>

                {/* Tech badges with brand icons */}
                <div className="flex flex-wrap gap-2">
                  {techTags.map((tag) => {
                    const techIcon = getTechIcon(tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent-cyan/5 border border-accent-cyan/15 hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:shadow-[0_0_10px_rgba(34,200,255,0.15)] transition-all duration-300 cursor-default"
                        style={{ color: techIcon.color }}
                      >
                        <techIcon.icon
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: techIcon.color }}
                        />
                        {tag}
                      </span>
                    );
                  })}
                </div>

                {/* Links */}
                {(project.github_url || project.live_url) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-dark-navy bg-accent-cyan hover:shadow-[0_0_20px_rgba(34,200,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-accent-cyan glass glow-border hover:shadow-[0_0_16px_rgba(34,200,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                      >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
