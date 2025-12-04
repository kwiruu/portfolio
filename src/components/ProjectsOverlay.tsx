import { useEffect, useRef, useCallback } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";

// Project data
const PROJECTS = [
  {
    id: "portfolio",
    title: "3D PORTFOLIO",
    description:
      "Interactive 3D portfolio website built with React Three Fiber, featuring FPS-style navigation and immersive experience.",
    tech: ["React", "Three.js", "TypeScript", "GSAP", "Tailwind CSS"],
    year: "2025",
    link: "#",
    featured: true,
  },
  {
    id: "ecommerce",
    title: "E-COMMERCE PLATFORM",
    description:
      "Full-stack e-commerce solution with user authentication, payment integration, and admin dashboard.",
    tech: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    year: "2024",
    link: "#",
  },
  {
    id: "taskmanager",
    title: "TASK MANAGEMENT APP",
    description:
      "Collaborative task management application with real-time updates and team features.",
    tech: ["React", "Firebase", "Redux", "Material UI"],
    year: "2024",
    link: "#",
  },
  {
    id: "weatherapp",
    title: "WEATHER DASHBOARD",
    description:
      "Weather application with location-based forecasts, interactive maps, and data visualization.",
    tech: ["Vue.js", "OpenWeather API", "Chart.js"],
    year: "2023",
    link: "#",
  },
  {
    id: "chatapp",
    title: "REAL-TIME CHAT",
    description:
      "Real-time messaging application with private and group chat functionality.",
    tech: ["Socket.io", "Express", "React", "PostgreSQL"],
    year: "2023",
    link: "#",
  },
];

export default function ProjectsOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const splitModeContent = useStore((state) => state.splitModeContent);
  const exitSplitMode = useStore((state) => state.exitSplitMode);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

    if (viewMode === "SPLIT_MODE" && splitModeContent === "projects") {
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
    if (viewMode !== "SPLIT_MODE" || splitModeContent !== "projects") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, splitModeContent, handleClose]);

  if (viewMode !== "SPLIT_MODE" || splitModeContent !== "projects") return null;

  return (
    <div
      ref={overlayRef}
      className="fixed left-0 top-0 w-1/2 h-full z-20 bg-white overflow-hidden"
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
        <div className="mb-8 animate-in">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 font-equitan leading-tight">
            Projects
          </h1>
          <p className="text-lg font-light text-neutral-400 font-equitan mt-2">
            Selected works & experiments
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex gap-10 mb-2 animate-in pb-8 border-b border-neutral-200">
          <div>
            <p className="text-3xl font-bold text-neutral-900 font-equitan">
              {PROJECTS.length}+
            </p>
            <p className="text-sm font-light text-neutral-400 font-equitan">
              Projects
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-400 font-equitan">
              Full Stack
            </p>
            <p className="text-sm font-light text-neutral-400 font-equitan">
              Focus
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-400 font-equitan">
              2025
            </p>
            <p className="text-sm font-light text-neutral-400 font-equitan">
              Latest
            </p>
          </div>
        </div>

        {/* All Projects */}
        <div className="space-y-4">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
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
  );
}

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  year: string;
  link?: string;
  featured?: boolean;
}

function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.link ? "a" : "div";
  const wrapperProps = project.link
    ? {
        href: project.link,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className="block group animate-in">
      <div className="py-6 border-b border-neutral-200 group-hover:border-neutral-400 transition-colors">
        {/* Main row */}
        <div className="flex items-start justify-between gap-4">
          {/* Year badge */}
          <div className="w-14 flex-shrink-0">
            <span className="text-sm font-light text-neutral-400 font-equitan">
              {project.year}
            </span>
          </div>

          {/* Left - Title and description */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-neutral-900 font-equitan leading-tight group-hover:text-neutral-600 transition-colors">
                {project.title}
              </h3>
              {project.featured && (
                <span className="text-[10px] font-light text-neutral-400 border border-neutral-300 px-2 py-0.5 rounded font-equitan">
                  FEATURED
                </span>
              )}
            </div>
            <p className="text-sm font-light text-neutral-500 font-equitan mt-1 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Right - Arrow for links */}
          {project.link && (
            <svg
              className="w-5 h-5 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all mt-1 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          )}
        </div>

        {/* Tech stack row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 ml-14">
          {project.tech.map((tech, index) => (
            <span
              key={tech}
              className="text-xs font-light text-neutral-400 font-equitan"
            >
              {tech}
              {index < project.tech.length - 1 && (
                <span className="ml-3 text-neutral-300">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
