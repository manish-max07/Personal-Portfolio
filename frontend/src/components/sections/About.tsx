"use client";

import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  Award,
  Play,
} from "lucide-react";

/* ── Stat cards data ────────────────────────────────────── */
const stats = [
  {
    value: "20,000+",
    label: "Users Served",
    icon: Users,
  },
  {
    value: "3x",
    label: "Hackathons Won",
    icon: Trophy,
  },
  {
    value: "7x",
    label: "Hackathon Finalist",
    icon: Award,
  },
  {
    value: "16k+",
    label: "YouTube Subscribers",
    icon: Play,
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

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section eyebrow */}
          <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan mb-4">
              02 / About Me
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Get to Know{" "}
              <span className="text-accent-cyan neon-cyan">Me</span>
            </h2>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Bio */}
            <motion.div variants={itemVariants}>
              <div className="glass rounded-2xl p-6 sm:p-8 glow-border">
                <p className="text-base sm:text-lg leading-relaxed text-text-secondary">
                  I&apos;m a Full Stack Developer, graduated with a B.Tech in Computer Science & Engineering from{" "}
                  <span className="text-text-primary font-medium">
                    Delhi Skill & Entrepreneurship University
                  </span>{" "}
                  in July 2026, with a CGPA of{" "}
                  <span className="text-accent-cyan font-semibold">8.20</span>,
                  passionate about automation, performance
                  optimization, and crafting seamless user experiences.
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-text-secondary mt-4">
                  I&apos;ve built production-level systems used by{" "}
                  <span className="text-accent-cyan font-semibold">
                    20,000+
                  </span>{" "}
                  users and won multiple hackathons along the way.
                </p>

                {/* Decorative accent line */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-[2px] w-12 bg-gradient-to-r from-accent-cyan to-transparent rounded-full" />
                  <span className="text-xs text-text-secondary font-[family-name:var(--font-orbitron)] tracking-wider uppercase">
                    Building the future
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Stat cards 2x2 grid */}
            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4"
              variants={sectionVariants}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={cardVariants}
                  className="group glass rounded-2xl p-5 sm:p-6 glow-border glow-border-hover flex flex-col items-center text-center cursor-default"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl glass flex items-center justify-center mb-3 group-hover:shadow-[0_0_16px_rgba(34,200,255,0.3)] transition-shadow duration-300">
                    <stat.icon className="w-5 h-5 text-accent-cyan" />
                  </div>

                  {/* Value */}
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent-cyan neon-cyan tracking-tight">
                    {stat.value}
                  </span>

                  {/* Label */}
                  <span className="text-xs sm:text-sm text-text-secondary mt-1 font-medium">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
