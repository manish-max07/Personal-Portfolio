"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  Loader2,
  Check,
  AlertCircle,
  Globe,
  GitBranch,
  Play,
  Link2,
} from "lucide-react";
import api from "@/lib/api";

/* ── Social links ───────────────────────────────────────── */
const socials = [
  { icon: Mail, label: "Email", href: "#" },
  { icon: Link2, label: "LinkedIn", href: "#" },
  { icon: GitBranch, label: "GitHub", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
  { icon: Globe, label: "Portfolio", href: "#" },
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

/* ── Form state types ───────────────────────────────────── */
interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }
    if (!message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setErrors({});

    try {
      await api.post("/contact/", {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { detail?: Array<{ loc?: string[]; msg?: string }> } } };
      if (axiosErr.response?.status === 422 && axiosErr.response?.data?.detail) {
        const fieldErrors: FormErrors = {};
        for (const d of axiosErr.response.data.detail) {
          const field = d.loc?.[d.loc.length - 1];
          if (field === "name") fieldErrors.name = d.msg;
          else if (field === "email") fieldErrors.email = d.msg;
          else if (field === "message") fieldErrors.message = d.msg;
        }
        setErrors(
          Object.keys(fieldErrors).length > 0
            ? fieldErrors
            : { general: "Validation error — please check your inputs." }
        );
      } else {
        setErrors({ general: "Something went wrong — please try again later." });
      }
    } finally {
      setSending(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-dark-navy/60 border border-white/10 text-text-primary text-sm placeholder-text-secondary/50 outline-none transition-all duration-300 focus:border-accent-cyan/50 focus:shadow-[0_0_16px_rgba(34,200,255,0.15)] focus:bg-dark-navy/80";

  return (
    <section
      id="contact"
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
              07 / Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Let&apos;s build something{" "}
              <span className="text-accent-cyan neon-cyan">together</span>
            </h2>
            <p className="mt-4 text-text-secondary text-base sm:text-lg max-w-2xl">
              Have a project in mind or want to collaborate? Drop me a message
              and I&apos;ll get back to you soon.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form — takes 3 columns */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-2xl p-8 sm:p-10 glow-border text-center"
                >
                  <div className="w-14 h-14 rounded-full glass glow-border flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-status-green" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Message sent!
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    Thanks for reaching out — I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-sm text-accent-cyan hover:text-cyan-glow transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-6 sm:p-8 glow-border space-y-5"
                  noValidate
                >
                  {/* General error */}
                  {errors.general && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.general}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-text-secondary mb-1.5 font-[family-name:var(--font-orbitron)] tracking-wider uppercase"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={`${inputBase} ${errors.name ? "border-red-500/50" : ""}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-text-secondary mb-1.5 font-[family-name:var(--font-orbitron)] tracking-wider uppercase"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`${inputBase} ${errors.email ? "border-red-500/50" : ""}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-text-secondary mb-1.5 font-[family-name:var(--font-orbitron)] tracking-wider uppercase"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about your project..."
                      rows={5}
                      className={`${inputBase} resize-none ${errors.message ? "border-red-500/50" : ""}`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 cursor-pointer select-none bg-accent-cyan text-dark-navy hover:shadow-[0_0_24px_rgba(34,200,255,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right side — social links */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 flex flex-col justify-center"
            >
              <div className="glass rounded-2xl p-6 sm:p-8 glow-border">
                <h3 className="text-sm font-semibold text-text-primary mb-5 font-[family-name:var(--font-orbitron)] tracking-wider uppercase">
                  Connect with me
                </h3>

                <div className="space-y-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="w-9 h-9 rounded-lg glass flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(34,200,255,0.3)] transition-shadow duration-300">
                        <social.icon className="w-4 h-4 text-accent-cyan" />
                      </div>
                      <span className="text-sm text-text-secondary group-hover:text-accent-cyan transition-colors duration-300">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Decorative */}
                <div className="mt-6 pt-5 border-t border-white/5">
                  <p className="text-xs text-text-secondary/60 leading-relaxed">
                    Usually respond within 24 hours.
                    <br />
                    Let&apos;s create something amazing.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
