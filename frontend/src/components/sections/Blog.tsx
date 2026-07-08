"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Folder, ChevronDown, PenTool } from "lucide-react";
import api from "@/lib/api";

/* ── Types ──────────────────────────────────────────────── */
interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string | null;
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
    <div className="glass rounded-2xl overflow-hidden animate-pulse flex flex-col">
      <div className="h-1 bg-gradient-to-r from-accent-cyan/20 via-accent-cyan/10 to-transparent" />
      <div className="p-5 sm:p-6 space-y-4 flex-1">
        <div className="h-6 w-3/4 rounded-lg bg-white/5" />
        <div className="h-4 w-1/4 rounded-lg bg-white/5" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded-lg bg-white/5" />
          <div className="h-4 w-5/6 rounded-lg bg-white/5" />
          <div className="h-4 w-2/3 rounded-lg bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get<BlogPost[]>("/blog/");
        setPosts(response.data);
      } catch {
        setError("Couldn't load posts right now — please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="blog" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          }}
          className="mb-12 sm:mb-16"
        >
          <span className="inline-block text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan mb-4">
            08 / Writing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Latest{" "}
            <span className="text-accent-cyan neon-cyan">Posts</span>
          </h2>
          <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl">
            Thoughts on software engineering, technology, and building products.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
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
        {!loading && !error && posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto glow-border"
          >
            <Folder className="w-10 h-10 text-accent-cyan/60 mx-auto mb-4" />
            <p className="text-text-secondary text-sm sm:text-base">
              No posts yet — check back soon!
            </p>
          </motion.div>
        )}

        {/* Posts grid */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-start"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {posts.map((post) => {
              const isExpanded = expandedId === post.id;
              const displaySummary =
                post.summary ||
                (post.content.length > 150
                  ? post.content.substring(0, 150) + "..."
                  : post.content);

              return (
                <motion.div
                  key={post.id}
                  variants={cardVariants}
                  layout
                  onClick={() => toggleExpand(post.id)}
                  className="group glass rounded-2xl overflow-hidden glow-border glow-border-hover transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                >
                  <div className="h-1 bg-gradient-to-r from-accent-cyan/60 via-cyan-glow/30 to-transparent group-hover:from-accent-cyan group-hover:via-cyan-glow/50 transition-all duration-500" />

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent-cyan transition-colors duration-300 leading-snug">
                        {post.title}
                      </h3>
                      <div className="w-8 h-8 rounded-lg glass flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:shadow-[0_0_16px_rgba(34,200,255,0.3)] transition-shadow duration-300">
                        <PenTool className="w-4 h-4 text-accent-cyan" />
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary/80 font-[family-name:var(--font-orbitron)] tracking-wider mb-4">
                      {formatDate(post.created_at)}
                    </p>

                    <AnimatePresence initial={false} mode="wait">
                      {!isExpanded ? (
                        <motion.p
                          key="summary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-text-secondary leading-relaxed mb-4 flex-1"
                        >
                          {displaySummary}
                        </motion.p>
                      ) : (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-text-secondary leading-relaxed mb-4 flex-1 whitespace-pre-wrap"
                        >
                          {post.content}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-1.5 pt-3 border-t border-white/5 text-xs font-medium text-accent-cyan mt-auto">
                      <span>{isExpanded ? "Show Less" : "Read More"}</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
