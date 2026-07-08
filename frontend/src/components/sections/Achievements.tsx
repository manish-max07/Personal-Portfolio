"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Medal, Users, Play, Star } from "lucide-react";

/* ── Achievements data ──────────────────────────────────── */
const achievements = [
  {
    icon: Trophy,
    title: "Runner-Up, Smart Delhi Ideathon 2025",
    description: "Top 100 of 53,000 teams, awarded by Delhi Govt.",
  },
  {
    icon: Award,
    title: "3x Hackathon Winner",
    description: "Multiple first-place finishes in competitive hackathons.",
  },
  {
    icon: Medal,
    title: "7x Hackathon Finalist",
    description: "Consistently reaching finals in national-level competitions.",
  },
  {
    icon: Users,
    title: "Creative Head / Student Instructor / VP",
    description: "Club of Programmers (CoPS) — leadership and mentoring.",
  },
  {
    icon: Play,
    title: "16k+ Subscriber YouTube Channel",
    description: "Creating educational tech content for a growing community.",
  },
];

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

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header */}
          <motion.div variants={headerVariants} className="mb-12 sm:mb-16">
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan mb-4">
              06 / Recognition
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-accent-cyan neon-cyan">Achievements</span>
            </h2>
          </motion.div>

          {/* Achievement cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {achievements.map((item) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="group glass rounded-2xl p-5 sm:p-6 glow-border glow-border-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl glass flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(34,200,255,0.35)] transition-shadow duration-300">
                  <item.icon className="w-5 h-5 text-accent-cyan" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-text-primary mb-2 leading-snug group-hover:text-accent-cyan transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {item.description}
                </p>

                {/* Decorative star */}
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-accent-cyan/30 group-hover:text-accent-cyan/60 fill-accent-cyan/20 group-hover:fill-accent-cyan/40 transition-colors duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
