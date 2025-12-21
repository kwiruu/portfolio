import { useEffect, useRef, useCallback, useState } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";
import jobtargetLogo from "../assets/education/jobtarget.png";
import keirulogo from "../assets/k-logo.svg";
import citulogo from "../assets/education/citlogo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Check if device is mobile
function checkIsMobile(): boolean {
  if (typeof window === "undefined") return false;
  const touchCapable = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const uaMobile =
    /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return touchCapable || coarse || uaMobile;
}

// Tech icons using Simple Icons CDN
const TECH_ICONS: Record<string, string> = {
  // Languages
  JavaScript: "https://cdn.simpleicons.org/javascript",
  TypeScript: "https://cdn.simpleicons.org/typescript",
  Python: "https://cdn.simpleicons.org/python",
  Java: "https://cdn.simpleicons.org/openjdk",
  "C#": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Logo_C_sharp.svg",
  "C++": "https://cdn.simpleicons.org/cplusplus",
  C: "https://cdn.simpleicons.org/c",
  PHP: "https://cdn.simpleicons.org/php",
  "ASP.NET": "https://cdn.simpleicons.org/dotnet",
  Django: "https://cdn.simpleicons.org/django",
  SQLite: "https://cdn.simpleicons.org/sqlite",
  SQL: "https://cdn.simpleicons.org/mysql",
  Bash: "https://cdn.simpleicons.org/gnubash",
  Firebase: "https://cdn.simpleicons.org/firebase",
  Supabase: "https://cdn.simpleicons.org/supabase",
  TensorFlow: "https://cdn.simpleicons.org/tensorflow",
  PyTorch: "https://cdn.simpleicons.org/pytorch",
  Pandas: "https://cdn.simpleicons.org/pandas",
  "Oracle Cloud Infrastructure":
    "https://logos-api.apistemic.com/domain:oracle.com",
  Android: "https://cdn.simpleicons.org/android",
  "React Native": "https://cdn.simpleicons.org/react",
  Babel: "https://cdn.simpleicons.org/babel",
  Jest: "https://cdn.simpleicons.org/jest",
  "Adobe Photoshop":
    "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
  "Adobe Premiere Pro":
    "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
  Blender: "https://cdn.simpleicons.org/blender",
  Godot: "https://cdn.simpleicons.org/godotengine",
  Unity:
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/Unity_Hub_Logo.png",
  Windows:
    "https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg",
  Ubuntu: "https://cdn.simpleicons.org/ubuntu",
  "Arch Linux": "https://cdn.simpleicons.org/archlinux",
  // Frontend
  React: "https://cdn.simpleicons.org/react",
  "Next.js": "https://cdn.simpleicons.org/nextdotjs",
  "Vue.js": "https://cdn.simpleicons.org/vuedotjs",
  "Tailwind CSS": "https://cdn.simpleicons.org/tailwindcss",
  HTML5: "https://cdn.simpleicons.org/html5",
  CSS3: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
  Bootstrap: "https://cdn.simpleicons.org/bootstrap",
  "Three.js": "https://cdn.simpleicons.org/threedotjs",
  // Backend
  "Node.js": "https://cdn.simpleicons.org/nodedotjs",
  "Express.js": "https://cdn.simpleicons.org/express",
  NestJS: "https://cdn.simpleicons.org/nestjs",
  FastAPI: "https://cdn.simpleicons.org/fastapi",
  // Databases
  MongoDB: "https://cdn.simpleicons.org/mongodb",
  PostgreSQL: "https://cdn.simpleicons.org/postgresql",
  MySQL: "https://cdn.simpleicons.org/mysql",
  Redis: "https://cdn.simpleicons.org/redis",
  // Cloud & DevOps
  AWS: "https://logos-api.apistemic.com/linkedin:amazon",
  Azure:
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
  GCP: "https://cdn.simpleicons.org/googlecloud",
  Docker: "https://cdn.simpleicons.org/docker",
  Kubernetes: "https://cdn.simpleicons.org/kubernetes",
  Linux: "https://cdn.simpleicons.org/linux",
  Git: "https://cdn.simpleicons.org/git",
  GitHub: "https://cdn.simpleicons.org/github",
  // Tools
  "VS Code": "https://logos-api.apistemic.com/domain:visualstudio.com",
  Figma: "https://cdn.simpleicons.org/figma",
  Postman: "https://cdn.simpleicons.org/postman",
  Vite: "https://cdn.simpleicons.org/vite",
  npm: "https://cdn.simpleicons.org/npm",
  Webpack: "https://cdn.simpleicons.org/webpack",
  ESLint: "https://cdn.simpleicons.org/eslint",
  Prettier: "https://cdn.simpleicons.org/prettier",
};

// Skills with proficiency levels
const SKILLS_DATA = {
  languages: [
    { name: "C", level: 70 },
    { name: "C++", level: 70 },
    { name: "C#", level: 65 },
    { name: "PHP", level: 75 },
    { name: "Java", level: 80 },
    { name: "Python", level: 85 },
    { name: "JavaScript", level: 90 },
  ],
  frontend: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Next.js", level: 75 },
    { name: "Three.js", level: 70 },
    { name: "Vue.js", level: 80 },
    { name: "React Native", level: 70 },
  ],
  backend: [
    { name: "Node.js", level: 85 },
    { name: "Express.js", level: 80 },
    { name: "NestJS", level: 70 },
    { name: "Django", level: 70 },
    { name: "ASP.NET", level: 65 },
    { name: "Python", level: 75 },
    { name: "REST APIs", level: 85 },
  ],
  databases: [
    { name: "MongoDB", level: 80 },
    { name: "PostgreSQL", level: 75 },
    { name: "MySQL", level: 70 },
    { name: "SQLite", level: 65 },
  ],
  cloud: [
    { name: "AWS", level: 70 },
    { name: "Azure", level: 75 },
    { name: "GCP", level: 65 },
    { name: "Oracle Cloud Infrastructure", level: 60 },
    { name: "Firebase", level: 75 },
    { name: "Supabase", level: 70 },
    { name: "Docker", level: 80 },
  ],
  aiMl: [
    { name: "TensorFlow", level: 65 },
    { name: "PyTorch", level: 60 },
    { name: "Pandas", level: 75 },
  ],
  tools: [
    { name: "Git", level: 85 },
    { name: "GitHub", level: 85 },
    { name: "Jest", level: 70 },
    { name: "Postman", level: 80 },
    { name: "Vite", level: 75 },
    { name: "ESLint", level: 75 },
    { name: "Prettier", level: 75 },
  ],
  design: [
    { name: "Figma", level: 85 },
    { name: "Adobe Photoshop", level: 70 },
    { name: "Adobe Premiere Pro", level: 65 },
    { name: "Blender", level: 70 },
  ],
  gameEngines: [
    { name: "Unity", level: 65 },
    { name: "Godot", level: 60 },
  ],
  operatingSystems: [
    { name: "Windows", level: 90 },
    { name: "Ubuntu", level: 80 },
    { name: "Arch Linux", level: 70 },
  ],
};

// Experience data
const EXPERIENCE_DATA = [
  {
    id: "exp-1",
    role: "Software Developer Intern",
    company: "Talleco JobTarget Inc.",
    period: "May 2025 - Oct 2025",
    description:
      "Developing full-stack web applications using React, NestJS, Jira, and cloud services. Collaborating with cross-functional teams to deliver high-quality software solutions.",
    technologies: ["React", "NestJS", "Jira", "PostgreSQL", "TypeScript"],
    type: "work",
    logo: jobtargetLogo,
  },
  {
    id: "exp-2",
    role: "Freelance Web Developer",
    company: "Self-Employed",
    period: "Jan 2023 - Present",
    description:
      "Building custom websites and web applications for clients. Focusing on responsive design, performance optimization, and modern development practices.",
    technologies: ["React", "Tailwind CSS", "NestJS", "TypeScript"],
    type: "freelance",
    logo: keirulogo,
  },
  {
    id: "exp-3",
    role: "CS Student Developer",
    company: "CIT-U",
    period: "2021 - 2026",
    description:
      "Developing academic projects and participating in hackathons. Learning and applying software engineering principles in real-world scenarios.",
    technologies: ["Java", "Python", "C++", "JavaScript"],
    type: "education",
    logo: citulogo,
  },
];

// Tech Stack categories
const TECH_STACKS = {
  languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C",
    "PHP",
    "SQL",
    "Bash",
  ],
  frontend: [
    "React",
    "Next.js",
    "Vue.js",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Three.js",
    "React Native",
    "Android",
    "Babel",
  ],
  backend: ["Node.js", "Express.js", "NestJS", "FastAPI", "Django", "ASP.NET"],
  databases: ["MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis"],
  cloud: [
    "AWS",
    "Azure",
    "GCP",
    "Oracle Cloud Infrastructure",
    "Firebase",
    "Supabase",
    "Docker",
    "Kubernetes",
    "Linux",
  ],
  tools: [
    "Git",
    "GitHub",
    "VS Code",
    "Figma",
    "Postman",
    "Vite",
    "npm",
    "ESLint",
    "Prettier",
    "Jest",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "Adobe Photoshop",
    "Adobe Premiere Pro",
    "Blender",
    "Godot",
    "Unity",
    "Windows",
    "Ubuntu",
    "Arch Linux",
  ],
};

// Skill item component with hover to reveal level
function SkillItem({ name, level }: { name: string; level: number }) {
  const icon = TECH_ICONS[name];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div
          className="group relative bg-white rounded-lg border border-neutral-100 p-3 hover:shadow-md transition-all cursor-pointer flex items-center gap-2 pl-5 py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center justify-center">
            {icon ? (
              <img src={icon} alt={name} className="w-8 h-8" />
            ) : (
              <span className="text-sm font-semibold text-neutral-600">
                {name.slice(0, 2)}
              </span>
            )}
          </div>

          {/* Level number - shown on hover to the right */}
          <div
            className={`overflow-hidden transition-all duration-200 ${
              isHovered ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-semibold text-neutral-800 font-equitan">
                {level}%
              </span>
              <span className="text-[11px] text-neutral-500 font-equitan">
                Proficient
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-medium">{name}</span>
      </TooltipContent>
    </Tooltip>
  );
}

// Tech icon component
function TechIcon({ name }: { name: string }) {
  const icon = TECH_ICONS[name];

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-110 cursor-pointer border border-neutral-100">
          {icon ? (
            <img src={icon} alt={name} className="w-7 h-7" />
          ) : (
            <span className="text-xs font-semibold text-neutral-600">
              {name.slice(0, 2)}
            </span>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-medium">{name}</span>
      </TooltipContent>
    </Tooltip>
  );
}

// Experience card component
function ExperienceCard({
  role,
  company,
  period,
  description,
  technologies,
  type,
  logo,
}: {
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  type: string;
  logo?: string;
}) {
  const typeColors: Record<string, string> = {
    work: "bg-blue-100 text-blue-700",
    freelance: "bg-green-100 text-green-700",
    education: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {logo && (
            <div className="w-12 h-12 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden p-1">
              <img
                src={logo}
                alt={`${company} logo`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-neutral-900 font-equitan">
              {role}
            </h3>
            <p className="text-sm text-neutral-500 font-equitan">{company}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[type]}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          <span className="text-xs text-neutral-400 font-equitan">
            {period}
          </span>
        </div>
      </div>
      <p className="text-sm text-neutral-600 font-equitan leading-relaxed mb-3">
        {description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded font-equitan"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// Tab component
function TabButton({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-equitan transition-all ${
        active
          ? "bg-neutral-900 text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export default function TechnicalOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const splitModeContent = useStore((state) => state.splitModeContent);
  const exitSplitMode = useStore((state) => state.exitSplitMode);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "skills" | "experience" | "techstack"
  >("all");

  const handleClose = useCallback(() => {
    if (!overlayRef.current) return;

    gsap.to(overlayRef.current, {
      x: "-100%",
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        exitSplitMode();
      },
    });
  }, [exitSplitMode]);

  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    if (viewMode === "SPLIT_MODE" && splitModeContent === "technical") {
      gsap.fromTo(
        overlayRef.current,
        { x: "-100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      const elements = contentRef.current.querySelectorAll(".animate-in");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }
  }, [viewMode, splitModeContent]);

  useEffect(() => {
    if (viewMode !== "SPLIT_MODE" || splitModeContent !== "technical") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        handleClose();
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Skip click-to-close on mobile to prevent touch event issues
      if (checkIsMobile()) return;

      const target = e.target as Node;

      // Ignore clicks on the navigation component
      const navElement = document.querySelector('[data-overlay-nav="true"]');
      if (navElement && navElement.contains(target)) {
        return;
      }

      // Close if clicking outside the overlay (on the right side where 3D scene is)
      if (overlayRef.current && !overlayRef.current.contains(target)) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [viewMode, splitModeContent, handleClose]);

  if (viewMode !== "SPLIT_MODE" || splitModeContent !== "technical")
    return null;

  return (
    <TooltipProvider>
      <div
        ref={overlayRef}
        className="fixed left-0 top-0 w-full md:w-1/2 h-full z-20 bg-white overflow-hidden"
        style={{ borderRight: "1px solid #e5e5e5" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 z-30 group"
          aria-label="Close"
        >
          <span className="text-sm font-light text-neutral-400 group-hover:text-neutral-900 transition-colors font-equitan">
            Close
          </span>
        </button>

        {/* Content */}
        <div
          ref={contentRef}
          className="h-full overflow-y-auto px-10 py-12 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Hero Header */}
          <div className="mb-6 animate-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 font-equitan leading-tight">
              Technical
            </h1>
            <p className="text-lg font-light text-neutral-400 font-equitan mt-2">
              Skills, Experience & Tech Stack
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex gap-10 mb-6 animate-in pb-6 border-b border-neutral-200">
            <div>
              <p className="text-3xl font-bold text-neutral-900 font-equitan">
                50+
              </p>
              <p className="text-sm font-light text-neutral-400 font-equitan">
                Technologies
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-400 font-equitan">
                4
              </p>
              <p className="text-sm font-light text-neutral-400 font-equitan">
                Cloud Platforms
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-neutral-400 font-equitan">
                3+
              </p>
              <p className="text-sm font-light text-neutral-400 font-equitan">
                Years Coding
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 animate-in">
            <TabButton
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              }
            >
              All
            </TabButton>
            <TabButton
              active={activeTab === "skills"}
              onClick={() => setActiveTab("skills")}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              }
            >
              Skills
            </TabButton>
            <TabButton
              active={activeTab === "experience"}
              onClick={() => setActiveTab("experience")}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            >
              Experience
            </TabButton>
            <TabButton
              active={activeTab === "techstack"}
              onClick={() => setActiveTab("techstack")}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              }
            >
              Tech Stack
            </TabButton>
          </div>

          {/* Tab Content */}
          <div className="animate-in">
            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                {/* Programming Languages */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Programming Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.languages.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Frontend Skills */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Frontend Development
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.frontend.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Backend Skills */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Backend Development
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.backend.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Database Skills */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Databases
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.databases.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Cloud & DevOps Skills */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Cloud & DevOps
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.cloud.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* AI / ML & Data */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    AI / ML & Data
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.aiMl.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Tools & Testing */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    Tools & Testing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.tools.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Design & Media */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    Design & Media
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.design.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Game Engines */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Game Engines
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.gameEngines.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>

                {/* Operating Systems */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    Operating Systems
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_DATA.operatingSystems.map((skill) => (
                      <SkillItem
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="space-y-4">
                {EXPERIENCE_DATA.map((exp) => (
                  <ExperienceCard
                    key={exp.id}
                    role={exp.role}
                    company={exp.company}
                    period={exp.period}
                    description={exp.description}
                    technologies={exp.technologies}
                    type={exp.type}
                    logo={exp.logo}
                  />
                ))}
              </div>
            )}

            {/* All Tab */}
            {activeTab === "all" && (
              <div className="space-y-8">
                {/* Skills Section */}
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-4">
                    Skills
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Programming Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.languages.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Frontend Development
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.frontend.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Backend Development
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.backend.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Databases
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.databases.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Cloud & DevOps
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.cloud.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500" />
                        AI / ML & Data
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.aiMl.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                        Tools & Testing
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.tools.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        Design & Media
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.design.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        Game Engines
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.gameEngines.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        Operating Systems
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_DATA.operatingSystems.map((skill) => (
                          <SkillItem
                            key={skill.name}
                            name={skill.name}
                            level={skill.level}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Experience Section */}
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-4">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {EXPERIENCE_DATA.map((exp) => (
                      <ExperienceCard
                        key={exp.id}
                        role={exp.role}
                        company={exp.company}
                        period={exp.period}
                        description={exp.description}
                        technologies={exp.technologies}
                        type={exp.type}
                        logo={exp.logo}
                      />
                    ))}
                  </div>
                </div>

                {/* Tech Stack Section */}
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-4">
                    Tech Stack
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACKS.languages.map((tech) => (
                          <TechIcon key={tech} name={tech} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Frontend
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACKS.frontend.map((tech) => (
                          <TechIcon key={tech} name={tech} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Backend
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACKS.backend.map((tech) => (
                          <TechIcon key={tech} name={tech} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        Databases
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACKS.databases.map((tech) => (
                          <TechIcon key={tech} name={tech} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Cloud & DevOps
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACKS.cloud.map((tech) => (
                          <TechIcon key={tech} name={tech} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-500" />
                        Tools & Workflow
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {TECH_STACKS.tools.map((tech) => (
                          <TechIcon key={tech} name={tech} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tech Stack Tab */}
            {activeTab === "techstack" && (
              <div className="space-y-6">
                {/* Languages */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.languages.map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                {/* Frontend */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Frontend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.frontend.map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Backend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.backend.map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                {/* Databases */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Databases
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.databases.map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                {/* Cloud & DevOps */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Cloud & DevOps
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.cloud.map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-equitan mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    Tools & Workflow
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACKS.tools.map((tech) => (
                      <TechIcon key={tech} name={tech} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-24" />
          <div className="fixed bottom-6 left-10 animate-in">
            <p className="text-sm font-light text-neutral-400 font-equitan">
              Press <span className="font-bold text-neutral-600">ESC</span> to
              return
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
