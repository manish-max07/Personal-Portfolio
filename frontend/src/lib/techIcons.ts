/**
 * Tech icon map — maps a technology name (case-insensitive) to its
 * official react-icons brand icon + brand color.
 *
 * Used by Skills section pills and Project modal tech badges.
 */

import { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiHtml5,
  SiCss,
  SiCplusplus,
  SiPostman,
  SiVercel,
  SiFastapi,
  SiRedis,
  SiGraphql,
  SiFirebase,
} from "react-icons/si";
import { FaCode, FaAws } from "react-icons/fa";

interface TechIconEntry {
  icon: IconType;
  color: string;
}

const techIconMap: Record<string, TechIconEntry> = {
  // Languages
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  python: { icon: SiPython, color: "#3776AB" },
  "c++": { icon: SiCplusplus, color: "#00599C" },
  c: { icon: SiCplusplus, color: "#A8B9CC" },

  // Frontend
  "react.js": { icon: SiReact, color: "#61DAFB" },
  react: { icon: SiReact, color: "#61DAFB" },
  "next.js": { icon: SiNextdotjs, color: "#E2E8F0" },
  nextjs: { icon: SiNextdotjs, color: "#E2E8F0" },
  html5: { icon: SiHtml5, color: "#E34F26" },
  css3: { icon: SiCss, color: "#1572B6" },
  "tailwind css": { icon: SiTailwindcss, color: "#06B6D4" },
  tailwind: { icon: SiTailwindcss, color: "#06B6D4" },

  // Backend
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  nodejs: { icon: SiNodedotjs, color: "#339933" },
  "express.js": { icon: SiExpress, color: "#E2E8F0" },
  express: { icon: SiExpress, color: "#E2E8F0" },
  fastapi: { icon: SiFastapi, color: "#009688" },

  // Databases
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  postgres: { icon: SiPostgresql, color: "#4169E1" },
  mysql: { icon: SiMysql, color: "#4479A1" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  redis: { icon: SiRedis, color: "#DC382D" },
  firebase: { icon: SiFirebase, color: "#FFCA28" },

  // DevOps & Tools
  docker: { icon: SiDocker, color: "#2496ED" },
  git: { icon: SiGit, color: "#F05032" },
  postman: { icon: SiPostman, color: "#FF6C37" },
  vercel: { icon: SiVercel, color: "#E2E8F0" },
  aws: { icon: FaAws, color: "#FF9900" },
  graphql: { icon: SiGraphql, color: "#E10098" },
};

/** Returns the icon entry for a technology name, falling back to a generic code icon. */
export function getTechIcon(name: string): TechIconEntry {
  const key = name.toLowerCase().trim();
  return techIconMap[key] ?? { icon: FaCode, color: "#22c8ff" };
}

/** All entries — useful for bulk iteration in Skills section. */
export { techIconMap };
