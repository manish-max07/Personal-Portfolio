"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, AlertCircle, Folder } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import api from "@/lib/api";
import { getTechIcon } from "@/lib/techIcons";
import ProjectModal from "@/components/projects/ProjectModal";

/* ── Types ──────────────────────────────────────────────── */
interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  github_url: string;
  live_url: string;
  image_urls?: string | null;
  created_at: string;
}

/* ── Animation variants ─────────────────────────────────── */
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

/* ── Skeleton card for loading state ────────────────────── */
function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-accent-cyan/20 via-accent-cyan/10 to-transparent" />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="h-6 w-3/4 rounded-lg bg-white/5" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-lg bg-white/5" />
          <div className="h-4 w-5/6 rounded-lg bg-white/5" />
          <div className="h-4 w-2/3 rounded-lg bg-white/5" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-full bg-white/5" />
          <div className="h-6 w-20 rounded-full bg-white/5" />
          <div className="h-6 w-14 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get<Project[]>("/projects/");
        setProjects(response.data);
      } catch {
        setError("Couldn't load projects right now — please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <section
        id="projects"
        className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header — always visible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94] as const,
            }}
            variants={headerVariants}
            className="mb-12 sm:mb-16"
          >
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan mb-4">
              04 / Selected Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Featured{" "}
              <span className="text-accent-cyan neon-cyan">Projects</span>
            </h2>
            <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl">
              Real-world applications I&apos;ve designed, built, and shipped.
            </p>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto glow-border"
            >
              <AlertCircle className="w-10 h-10 text-accent-cyan/60 mx-auto mb-4" />
              <p className="text-text-secondary text-sm sm:text-base">{error}</p>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto glow-border"
            >
              <Folder className="w-10 h-10 text-accent-cyan/60 mx-auto mb-4" />
              <p className="text-text-secondary text-sm sm:text-base">
                No projects yet — check back soon!
              </p>
            </motion.div>
          )}

          {/* Project cards */}
          {!loading && !error && projects.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {projects.map((project) => {
                const techTags = project.tech_stack
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);

                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    className="group glass rounded-2xl overflow-hidden glow-border glow-border-hover transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Top gradient accent */}
                    <div className="h-1 bg-gradient-to-r from-accent-cyan/60 via-cyan-glow/30 to-transparent group-hover:from-accent-cyan group-hover:via-cyan-glow/50 transition-all duration-500" />

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg glass flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:shadow-[0_0_16px_rgba(34,200,255,0.3)] transition-shadow duration-300">
                          <Folder className="w-4 h-4 text-accent-cyan" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors duration-300 leading-snug">
                          {project.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech tags with brand icons */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {techTags.slice(0, 4).map((tag) => {
                          const techIcon = getTechIcon(tag);
                          return (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-accent-cyan/5 border border-accent-cyan/15 hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:shadow-[0_0_10px_rgba(34,200,255,0.15)] transition-all duration-300 cursor-default"
                              style={{ color: techIcon.color }}
                            >
                              <techIcon.icon
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: techIcon.color }}
                              />
                              {tag}
                            </span>
                          );
                        })}
                        {techTags.length > 4 && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium text-text-secondary bg-white/5 border border-white/10 cursor-default">
                            +{techTags.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Action row */}
                      <div className="flex items-center justify-center gap-6 pt-3 border-t border-white/5">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent-cyan transition-colors duration-300"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Demo</span>
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-accent-cyan transition-colors duration-300"
                          >
                            <FaGithub className="w-3.5 h-3.5" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Project detail modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
