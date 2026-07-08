"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

/* ── Timeline data ──────────────────────────────────────── */
const experiences = [
  {
    role: "Full Stack Developer Intern (6 Months Internship)",
    company: "Delhi Skill and Entrepreneurship University (DSEU)",
    duration: "May 2025 – Nov 2025",
    bullets: [
      "Built a university-wide ERP system used by over 20,000 students, streamlining academic and administrative operations",
      "Frontend: responsive web application using Next.js 14, TypeScript, and Tailwind CSS for student and admin portals with dynamic routing and server-side rendering",
      "Backend: RESTful API using Node.js, Express.js, and TypeScript with modular architecture (controllers, services, middleware) for authentication and data validation",
      "Database: designed and managed PostgreSQL database with custom migration system, complex queries for student records, exam registration, and result management",
      "Automation & DevOps: integrated CI/CD pipelines, PM2 for deployment, and Postman for testing and documentation",
    ],
  },
  {
    role: "Summer Internship",
    company: "All India Council for Technical Education (AICTE)",
    duration: "Jun 2024 - Jul 2024 (2 months)",
    bullets: [
      "Completed IBM-focused curriculum and training to learn cloud computing and artificial intelligence paradigms",
      "Earned professional certification: 'Journey to Cloud : Envisioning Your Solution' by IBM",
      "Earned professional certification: 'IBM Artificial Intelligence' by IBM",
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

export default function Experience() {
  return (
    <section
      id="experience"
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
          <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase font-[family-name:var(--font-orbitron)] text-accent-cyan mb-4">
              05 / Experience
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Work{" "}
              <span className="text-accent-cyan neon-cyan">Experience</span>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-8 sm:pl-12 pb-12 last:pb-0"
              >
                {/* Vertical line */}
                <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-accent-cyan/40 via-accent-cyan/20 to-transparent" />

                {/* Glowing dot */}
                <div className="absolute left-0 sm:left-1 top-1.5">
                  <div className="relative">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full glass glow-border flex items-center justify-center">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-accent-cyan" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-accent-cyan/20 animate-ping" style={{ animationDuration: "3s" }} />
                  </div>
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-5 sm:p-6 lg:p-8 glow-border glow-border-hover transition-all duration-300 hover:-translate-y-0.5">
                  {/* Role & company */}
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-sm sm:text-base text-accent-cyan font-medium">
                      {exp.company}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-[family-name:var(--font-orbitron)] tracking-wider">
                        {exp.duration}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-accent-cyan/20 via-accent-cyan/10 to-transparent mb-4" />

                  {/* Bullets */}
                  <ul className="space-y-3">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-text-secondary leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
