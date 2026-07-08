"use client";

import { motion } from "framer-motion";
import {
  Code,
  Layout,
  Server,
  Database,
  Wrench,
  Brain,
} from "lucide-react";
import { getTechIcon } from "@/lib/techIcons";

/* ── Skill categories ───────────────────────────────────── */
const categories = [
  {
    title: "Languages",
    icon: Code,
    skills: ["C++", "C", "Python", "JavaScript"],
  },
  {
    title: "Frontend",
    icon: Layout,
    skills: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express.js", "FastAPI", "RESTful APIs", "Microservices"],
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    title: "DevOps & Tools",
    icon: Wrench,
    skills: ["Docker", "PM2", "CI/CD", "Git", "Postman"],
  },
  {
    title: "Other",
    icon: Brain,
    skills: [
      "Data Structures & Algorithms",
      "Problem Solving",
      "Machine Learning",
    ],
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

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Section eyebrow + heading */}
          <motion.div variants={headerVariants} className="mb-12 sm:mb-16">
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan mb-4">
              03 / Tech Stack
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Skills &{" "}
              <span className="text-accent-cyan neon-cyan">Technologies</span>
            </h2>
            <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl">
              The tools and technologies I work with to build scalable,
              high-performance applications.
            </p>
          </motion.div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.title}
                variants={cardVariants}
                className="group glass rounded-2xl p-5 sm:p-6 glow-border glow-border-hover transition-all duration-300"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg glass flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(34,200,255,0.3)] transition-shadow duration-300">
                    <category.icon className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary tracking-wide font-[family-name:var(--font-orbitron)]">
                    {category.title}
                  </h3>
                </div>

                {/* Skill pills with brand icons */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => {
                    const techIcon = getTechIcon(skill);
                    return (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-accent-cyan/5 border border-accent-cyan/15 hover:border-accent-cyan/40 hover:bg-accent-cyan/10 hover:shadow-[0_0_10px_rgba(34,200,255,0.15)] transition-all duration-300 cursor-default"
                        style={{ color: techIcon.color }}
                      >
                        <techIcon.icon
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: techIcon.color }}
                        />
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
