"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  User,
  Code,
  Server,
  Terminal,
  Database,
  Container,
  FileCode,
  Cloud,
  GitBranch,
  Trophy,
  ArrowRight,
  Download,
} from "lucide-react";
import Button from "@/components/ui/Button";

/* ── Typewriter titles ──────────────────────────────────── */
const titles = [
  "Full Stack Developer",
  "React & Node.js Engineer",
  "Python Developer",
  "Hackathon Winner",
];

function useTypewriter(words: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
          if (displayText.length + 1 === currentWord.length) {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, wordIndex, isDeleting, words, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

/* ── Orbiting skill badges ──────────────────────────────── */
const skills = [
  { icon: Code, label: "React" },
  { icon: Server, label: "Node.js" },
  { icon: Terminal, label: "Python" },
  { icon: Database, label: "Database" },
  { icon: Container, label: "Docker" },
  { icon: FileCode, label: "TypeScript" },
  { icon: Cloud, label: "Cloud" },
  { icon: GitBranch, label: "Git" },
];

/* ── Stagger animation variants ─────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
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

const photoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      delay: 0.5,
    },
  },
};

export default function Hero() {
  const typedText = useTypewriter(titles);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* ── Left: Text content ──────────────────────── */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass glow-border text-xs tracking-widest uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-status-green opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-green" />
                </span>
                Available for hire
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight mb-4"
            >
              Hi, I&apos;m{" "}
              <span className="text-accent-cyan neon-cyan">Manish Kumar</span>
            </motion.h1>

            {/* Typewriter subtitle */}
            <motion.div
              variants={itemVariants}
              className="h-10 sm:h-12 mb-6 flex items-center justify-center lg:justify-start"
            >
              <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-text-secondary">
                {typedText}
                <span
                  className="inline-block w-[3px] h-[1em] ml-1 bg-accent-cyan align-middle"
                  style={{ animation: "cursor-blink 0.8s step-end infinite" }}
                />
              </span>
            </motion.div>

            {/* Summary */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Full stack developer building scalable web apps used by{" "}
              <span className="text-accent-cyan font-medium">20,000+</span>{" "}
              users, passionate about automation and performance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                variant="solid"
                href="#projects"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View Projects
              </Button>
              <Button
                variant="outline"
                href="/resume.pdf"
                icon={<Download className="w-4 h-4" />}
              >
                Download Resume
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right: Profile photo + orbiting badges ── */}
          <motion.div
            className="relative flex-shrink-0"
            variants={photoVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Orbit container */}
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px]">
              {/* Faint orbit ring */}
              <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-full border border-accent-cyan/10" />
              <div className="absolute inset-0 rounded-full border border-accent-cyan/5" />

              {/* Profile photo */}
              <div className="absolute inset-[25%] rounded-full bg-deep-blue/80 glass glow-border flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-deep-blue to-dark-navy overflow-hidden">
                  <Image
                    src="/ManishAnime.png"
                    alt="Manish Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Orbiting skill badges — desktop: orbit animation, mobile: static ring */}
              {!isMobile ? (
                /* Desktop: animated orbit */
                skills.map((skill, index) => {
                  const angle = (360 / skills.length) * index;
                  const duration = 30 + index * 2; // Slight speed variation
                  return (
                    <div
                      key={skill.label}
                      className="absolute top-1/2 left-1/2 w-0 h-0"
                      style={{
                        animation: `orbit ${duration}s linear infinite`,
                        animationDelay: `${-(duration / skills.length) * index}s`,
                        ["--orbit-radius" as string]: "170px",
                        transform: `rotate(${angle}deg) translateX(170px) rotate(-${angle}deg)`,
                      }}
                    >
                      <div className="relative -top-5 -left-5 w-10 h-10 rounded-xl glass glow-border flex items-center justify-center group transition-all duration-300 hover:scale-110">
                        <skill.icon className="w-4 h-4 text-accent-cyan" />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-[family-name:var(--font-orbitron)]">
                          {skill.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Mobile: static grid below the circle — rendered outside this container */
                null
              )}

              {/* Hackathon winner badge */}
              <motion.div
                className="absolute -right-2 top-6 sm:-right-4 sm:top-8"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass glow-border text-xs font-medium text-accent-cyan whitespace-nowrap">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  3x Hackathon Winner
                </div>
              </motion.div>
            </div>

            {/* Mobile: static skill badges row */}
            {isMobile && (
              <motion.div
                className="flex flex-wrap justify-center gap-2 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {skills.map((skill) => (
                  <div
                    key={skill.label}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass glow-border text-xs text-accent-cyan"
                  >
                    <skill.icon className="w-3.5 h-3.5" />
                    {skill.label}
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-secondary font-[family-name:var(--font-orbitron)]">
          Scroll
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-accent-cyan/30 flex justify-center pt-1.5"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-1.5 rounded-full bg-accent-cyan"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
