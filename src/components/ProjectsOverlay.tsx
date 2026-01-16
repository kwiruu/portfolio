import { useEffect, useRef, useCallback, useState } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";
import { Cog, Fullscreen } from "lucide-react";

// Project data
const PROJECTS = [
  {
    id: "chumcode",
    title: "CHUMCODE",
    description:
      "Collaborative coding education platform inspired by Codecademy and Microsoft Teams. Features course management, student enrollment, activity assignments, real-time collaboration, and user dashboards for both teachers and students.",
    about:
      "ChumCode is a comprehensive learning management system designed for programming education. The platform enables teachers to create and manage courses, assign activities, and track student progress. Students can enroll in courses, complete assignments, and collaborate with peers. The system includes user authentication, role-based access control, course catalogs with popular programming languages (HTML, Python, JavaScript, Java, C#, AI), and detailed user profiles. Built with a focus on interactive learning and real-time collaboration.",
    tech: ["PHP", "MySQL", "JavaScript", "Bootstrap", "CSS"],
    libraries: ["jQuery", "GSAP", "Bootstrap 4"],
    tools: ["XAMPP", "phpMyAdmin", "Git"],
    year: "2023",
    repository: "https://github.com/kwiruu/ChumCode",
    featured: false,
    images: ["chumcode.png"],
  },
  {
    id: "effortlist",
    title: "EFFORTLIST",
    description:
      "Android productivity application featuring todo lists, notes, and list management. Built with Material Design principles and SQLite database for local data persistence.",
    about:
      "EffortList is a comprehensive Android productivity app that combines task management, note-taking, and list organization into one seamless experience. The app features a bottom navigation interface with dedicated sections for tasks (Todo), notes, and custom lists. Users can create, edit, and organize their tasks with an intuitive swipe-to-delete gesture powered by RecyclerView. The app includes user authentication with login and registration, a beautiful splash screen, and a home dashboard that provides an overview of all activities. Built with Android's ViewBinding for efficient view access and SQLite database for reliable local data storage.",
    tech: ["Java", "Android SDK", "SQLite", "XML"],
    libraries: ["Material Components", "RecyclerView", "ConstraintLayout"],
    tools: ["Android Studio", "Gradle", "Git"],
    year: "2023",
    repository: "https://github.com/kwiruu/EffortList-",
    featured: false,
    images: [
      "effortlist.jpg",
      "effortlist1.jpg",
      "effortlist2.jpg",
      "effortlist3.jpg",
      "effortlist4.jpg",
    ],
  },
  {
    id: "litterbox",
    title: "LITTERBOX",
    description:
      "Student blog management system designed for creative expression. Features user authentication, profile management, content creation with rich text editor, and interactive community features.",
    about:
      "Litterbox is a comprehensive blogging platform built specifically for students to share knowledge, foster creativity, and build community. The platform includes secure user authentication with email verification and password reset, personalized profile management, and a powerful blog post system with categorization and tagging. Users can interact through comments, likes, and replies, creating an engaging social experience. The platform also features a calendar system for viewing school events and setting personal reminders. Built with Django and Tailwind CSS, Litterbox uses TinyMCE for rich text editing and FullCalendar for event management, providing students with a complete and intuitive blogging experience.",
    tech: ["Django", "Python", "SQLite", "HTML", "JavaScript"],
    libraries: ["Tailwind CSS", "FullCalendar", "TinyMCE"],
    tools: ["Git", "GitHub"],
    year: "2024",
    repository: "https://github.com/rei-naissance/Litterbox",
    featured: false,
    images: ["litterbox.gif"],
  },
  {
    id: "finitestate",
    title: "FINITE STATE MACHINE",
    description:
      "Interactive character movement system demonstrating finite state machine concepts using Pygame. Features sprite animations, real-time state visualization, and physics-based movement with idle, walking, and jumping states.",
    about:
      "Finite State Machine is an educational Python game that demonstrates FSM (Finite State Machine) concepts through an interactive character movement system. Built with Pygame, the project showcases how state machines control character behavior with three distinct states: idle, walking, and jumping. The character responds to keyboard input (A/D for movement, W for jumping) and transitions between states following a defined state transition table. Each state has its own sprite animation, and the current state is displayed in real-time on the screen for educational purposes. The jumping mechanic includes gravity physics that brings the character back down to the floor. This project serves as a practical demonstration of FSM theory in game development, making abstract programming concepts tangible through visual feedback and interactive gameplay.",
    tech: ["Python", "Pygame"],
    libraries: ["Pygame"],
    tools: ["Python 3.x", "Git"],
    year: "2025",
    repository: "https://github.com/kwiruu/finite-state-machine",
    featured: false,
    images: ["fsm.png", "fsm1.png"],
  },
  {
    id: "collabora",
    title: "COLLABORA",
    description:
      "Real-time collaboration platform connecting individuals based on shared goals, interests, and skills. Features intelligent matchmaking, real-time messaging, profile customization, and collaborative work sessions.",
    about:
      "Collabora is a full-stack web application designed to help students and professionals connect and collaborate based on shared objectives. The platform features a sophisticated real-time matching system that pairs users with compatible collaborators by analyzing their interests, skills, and current goals. Built with ASP.NET Core for the backend and React with TailwindCSS for the frontend, Collabora provides a seamless user experience with real-time messaging powered by SignalR. Users can create detailed profiles highlighting their skills and interests, participate in focused study or work sessions, and communicate efficiently through integrated chat features. The application supports both one-on-one connections and team collaborations, making it ideal for exam preparation, group projects, or brainstorming sessions. With its emphasis on goal-oriented matchmaking and real-time communication, Collabora fosters meaningful connections that drive both academic and professional growth.",
    tech: ["ASP.NET Core", "C#", "React", "Node.js", "JavaScript"],
    libraries: [
      "TailwindCSS",
      "SignalR",
      "React Router",
      "Entity Framework Core",
      "Swiper",
    ],
    tools: ["Visual Studio", "Create React App", "ESLint", "Git", "Figma"],
    year: "2025",
    repositories: [
      "https://github.com/Mars0827/backend_collabora",
      "https://github.com/kwiruu/collabora-frontend",
    ],
    featured: false,
    images: [
      "collabora.gif",
      "collabora1.png",
      "collabora2.png",
      "collabora3.png",
    ],
  },
  {
    id: "jssneaks",
    title: "JS SNEAKS",
    description:
      "Online thrifted shoe store built with the MERN stack. Features responsive design, shoe inventory browsing, and modern e-commerce interface. Deployed on Vercel with full-stack architecture.",
    about:
      "JS Sneaks is a full-stack web application designed as an online thrifted shoe store, showcasing a curated collection of unique and stylish shoes. Built with the MERN stack (MongoDB, Express, React, Node.js), the application provides a seamless browsing experience with responsive design for both desktop and mobile devices. The frontend is built with React and Vite for fast development, styled with TailwindCSS for a modern, utility-first approach, and enhanced with Headless UI components for accessibility. The backend API is powered by Express and Node.js with MongoDB for data persistence. The application features a clean product catalog interface with detailed shoe information, responsive grid layouts, and smooth navigation using React Router. Deployed on Vercel for optimal performance and reliability.",
    tech: ["MongoDB", "Express", "React", "Node.js", "JavaScript"],
    libraries: [
      "TailwindCSS",
      "Headless UI",
      "React Router",
      "Heroicons",
      "Axios",
    ],
    tools: ["Vite", "ESLint", "Nodemon", "Vercel", "Git"],
    year: "2024",
    repository: "https://github.com/kwiruu/js-sneaks-mern-app",
    website: "https://js-sneaks.vercel.app/",
    featured: true,
    images: ["jssneaks.png", "jssneaks1.png", "jssneaks2.png", "jssneaks3.png"],
  },
  {
    id: "undercooked",
    title: "UNDERCOOKED",
    description:
      "Overcooked-inspired cooking simulation game built with libGDX. Features cooperative multiplayer gameplay, time management, recipe preparation, and level progression with MySQL database integration.",
    about:
      "Undercooked is a fast-paced cooking simulation game developed as a final capstone project for Object Oriented Programming 2 at Cebu Institute of Technology - University. The game challenges players to prepare various dishes under time pressure, managing ingredients, cooking stations, and order delivery. Built with libGDX framework, the game features multiple levels with increasing difficulty, animated character sprites, interactive cooking stations (chopping boards, stoves, ovens, rice cookers), and a complete recipe system. The game integrates MySQL database through XAMPP for storing player data, high scores, and game progress. With pixel art aesthetics created in Aseprite and custom level design in Tiled map editor, Undercooked delivers an engaging cooperative multiplayer experience with sound effects and 8-bit background music.",
    tech: ["Java", "libGDX", "MySQL", "Gradle"],
    libraries: ["Tween Engine", "LWJGL3"],
    tools: ["IntelliJ IDEA", "XAMPP", "Aseprite", "Tiled", "Gradle"],
    year: "2024",
    repository: "https://github.com/kwiruu/Undercooked-",
    featured: true,
    images: [
      "undercooked.png",
      "undercooked1.gif",
      "undercooked2.png",
      "undercooked3.gif",
      "undercooked4.png",
      "undercooked6.gif",
    ],
  },
  {
    id: "hum-ai",
    title: "HUM.AI",
    description:
      "AI-powered rice quality grading system using CNN and NIR imaging technology. Automated grading tool aligned with Philippine National Standards (PNS/BAFS-290:2019) for accurate quality assessment.",
    about:
      "Hum.AI is an automated rice grading web application that leverages Convolutional Neural Networks (CNN) and Near-Infrared (NIR) imaging to assess rice grain quality according to Philippine National Standards (PNS/BAFS-290:2019). The platform features a React-based frontend built with Vite and TypeScript, offering an intuitive interface for uploading rice grain images or capturing them in real-time through device camera selection. The FastAPI backend processes images through a CNN model to generate comprehensive grading metrics including moisture content, grain size uniformity, and quality classification. Results are displayed through an interactive radar chart visualization using Recharts, providing users with a clear overview of key quality indicators. The system generates exportable JSON reports for documentation and compliance purposes. With its focus on automation and standardization, Hum.AI streamlines the rice grading process, making quality assessment faster, more consistent, and aligned with industry standards.",
    tech: ["React", "TypeScript", "Python", "FastAPI", "JavaScript"],
    libraries: [
      "Vite",
      "Tailwind CSS",
      "Recharts",
      "Lucide React",
      "React Spinners",
      "CORS Middleware",
    ],
    tools: ["TypeScript Compiler", "Vite", "Git", "Python Virtual Environment"],
    year: "2025",
    repositories: [
      "https://github.com/One-Team-One-Goal/hum.ai-server",
      "https://github.com/One-Team-One-Goal/hum.ai-ui",
    ],
    Website: "https://www.hum-ai.app/",
    featured: true,
    images: ["hum-ai.png", "hum-ai1.png", "hum-ai2.png", "hum-ai3.png"],
  },
  {
    id: "bitwise",
    title: "BITWISE",
    description:
      "Interactive web-based learning platform for Boolean algebra with step-by-step simplification, visual K-Map minimizer, and logic circuit visualizer. Features adaptive lessons and quizzes for self-paced learning.",
    about:
      "Bitwise is a comprehensive web-based interactive learning platform designed to help students understand Boolean algebra through step-by-step simplification and visual representation. Unlike traditional solvers that only show final answers, Bitwise explains each applied Boolean law and displays the full solution process, making it an invaluable tool for learning digital logic. The platform includes three core features: a Boolean equation solver that breaks down simplification steps, a visual Karnaugh Map (K-Map) minimizer for optimizing Boolean expressions, and a logic circuit visualizer that converts expressions into corresponding logic gate diagrams. Students can follow along with adaptive lessons tailored to their learning pace and test their understanding through interactive quizzes. Developed as a Software Engineering academic project at Cebu Institute of Technology - University using NestJS for the backend and React for the frontend, Bitwise focuses on improving conceptual understanding of digital logic through guided, visual, and interactive learning experiences. The platform bridges the gap between theory and practice, helping students master Boolean algebra fundamentals essential for computer science and electrical engineering.",
    tech: ["NestJS", "React", "TypeScript", "Node.js", "JavaScript"],
    libraries: [
      "React Router",
      "Axios",
      "TypeORM",
      "Class Validator",
      "JWT",
      "Tailwind CSS",
    ],
    tools: ["Git", "Render", "TypeScript Compiler", "npm", "Figma"],
    year: "2025",
    repositories: [
      "https://github.com/One-Team-One-Goal/bitwise-server",
      "https://github.com/One-Team-One-Goal/bitwise-ui",
    ],
    website: "https://dev-bitwise.onrender.com/roadmap",
    featured: true,
    images: ["bitwise1.png", "bitwise2.png", "bitwise3.png", "bitwise4.png"],
  },
  {
    id: "portfolio",
    title: "PORTFOLIO",
    description:
      "Immersive 3D portfolio website featuring first-person navigation through an interactive virtual room. Built with React Three Fiber, showcasing projects, skills, and experience in a unique spatial environment.",
    about:
      "This portfolio website reimagines the traditional web portfolio by creating an immersive 3D experience where visitors can explore a virtual room in first-person perspective. Built with React, TypeScript, and React Three Fiber (R3F), the project leverages Three.js to render a fully interactive 3D environment complete with realistic lighting, shadows, and physics-based collision detection. Visitors can navigate using WASD controls (desktop) or touch controls (mobile) to move around the room and interact with various objects that reveal different sections of the portfolio. The experience includes interactive picture frames displaying projects, a trophy showcasing achievements, and a computer desk revealing technical skills. The application features smooth camera transitions, split-screen overlay panels for detailed content viewing, and responsive design that adapts to both desktop and mobile devices. State management is handled through Zustand, animations are powered by GSAP, and the entire experience is optimized for performance with lazy loading and efficient rendering. This portfolio demonstrates expertise in 3D web development, creative UI/UX design, and modern frontend technologies while providing visitors with a memorable and engaging way to explore professional work.",
    tech: [
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "JavaScript",
    ],
    libraries: [
      "React Three Fiber",
      "React Three Drei",
      "GSAP",
      "Zustand",
      "Tailwind CSS",
      "Framer Motion",
    ],
    tools: ["Vite", "TypeScript Compiler", "Blender", "Git", "Vercel"],
    year: "2025",
    repository: "https://github.com/kwiruu/portfolio",
    website: "https://www.keiru.dev",
    featured: true,
    images: [
      "portfolio1.png",
      "portfolio2.png",
      "portfolio3.png",
      "portfolio4.png",
    ],
  },
  {
    id: "kwentamo",
    title: "KWENTAMO",
    description:
      "Intelligent business management platform for Filipino MSMEs with AI-powered receipt scanning, automated expense categorization, inventory tracking, and financial analytics. Features microservices architecture with multi-engine OCR processing.",
    about:
      "KwentaMo is a comprehensive business management solution designed specifically for Filipino micro, small, and medium enterprises (MSMEs). The platform leverages cutting-edge AI and machine learning to automate tedious bookkeeping tasks through intelligent receipt scanning using a multi-engine OCR system (RapidOCR, PaddleOCR, EasyOCR, Donut) with fallback capabilities for maximum accuracy. The system automatically extracts vendor information, line items, totals, and intelligently categorizes expenses using fuzzy matching and a learning algorithm that adapts to user corrections. Beyond receipt processing, KwentaMo provides complete inventory management with period tracking, recipe costing with labor and overhead calculations, sales tracking with profit analysis, and comprehensive financial reporting. The application features a microservices architecture with three main services: a NestJS backend API with PostgreSQL and Prisma ORM, a React Router frontend with server-side rendering and real-time updates via Supabase, and a Python FastAPI receipt processing microservice. Users can export financial data to Excel and PDF, manage multiple document types (receipts, utility bills, rent), and access detailed analytics through interactive charts powered by Recharts. With Supabase authentication, JWT-based sessions, row-level security, and containerized deployment across Vercel, Render, and HuggingFace, KwentaMo delivers enterprise-grade reliability while remaining accessible to small businesses.",
    tech: [
      "React Router",
      "TypeScript",
      "NestJS",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
    libraries: [
      "React 19",
      "Tailwind CSS",
      "Prisma",
      "Supabase",
      "TanStack Query",
      "Zustand",
      "shadcn/ui",
      "Radix UI",
      "RapidOCR",
      "PaddleOCR",
      "EasyOCR",
      "Recharts",
      "React Hook Form",
      "Zod",
    ],
    tools: [
      "Vite",
      "Docker",
      "Vercel",
      "Render",
      "HuggingFace",
      "Git",
      "Jest",
      "ESLint",
      "Prettier",
    ],
    year: "2026",
    repositories: [
      "https://github.com/kwiruu/kwenta-mo-app",
      "https://github.com/kwiruu/kwenta-mo-api",
      "https://huggingface.co/spaces/kwiruu/kwentamo-receipt-scanner/tree/main",
    ],
    website: "https://kwenta-mo.vercel.app/",
    featured: true,
    images: [
      "kwentamo1.png",
      "kwentamo2.png",
      "kwentamo3.png",
      "kwentamo4.png",
      "kwentamo5.png",
      "kwentamo6.png",
    ],
  },
];

export default function ProjectsOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const splitModeContent = useStore((state) => state.splitModeContent);
  const exitSplitMode = useStore((state) => state.exitSplitMode);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Image overlay state
  const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const openImageOverlay = (project: Project, imageIndex: number) => {
    setCurrentProject(project);
    setCurrentImageIndex(imageIndex);
    setIsImageOverlayOpen(true);
  };

  const closeImageOverlay = () => {
    setIsImageOverlayOpen(false);
  };

  const nextImage = () => {
    if (
      currentProject?.images &&
      currentImageIndex < currentProject.images.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Keyboard navigation for image overlay
  useEffect(() => {
    if (!isImageOverlayOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "Escape") {
        closeImageOverlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isImageOverlayOpen, currentImageIndex, currentProject]);

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
        { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" },
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
        },
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
    <>
      {/* Full Panel Image Overlay */}
      {isImageOverlayOpen && currentProject?.images && (
        <div
          className="fixed left-0 top-0 w-[70%] md:w-1/2 h-full z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={closeImageOverlay}
        >
          {/* Close button */}
          <button
            onClick={closeImageOverlay}
            className="absolute top-6 right-6 text-white hover:text-neutral-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation buttons */}
          {currentProject.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                disabled={currentImageIndex === 0}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-1 bg-neutral-800 hover:bg-neutral-700 rounded-full text-whitedisabled:opacity-30 disabled:cursor-not-allowed transition-all z-10 shadow-lg"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                disabled={
                  currentImageIndex === currentProject.images.length - 1
                }
                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 bg-neutral-800 hover:bg-neutral-700 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10 shadow-lg"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image container */}
          <div
            className="relative max-h-[90vh] max-w-[90%] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/projectImages/${currentProject.images[currentImageIndex]}`}
              alt={`${currentProject.title} - Image ${currentImageIndex + 1}`}
              className="max-h-[90vh] max-w-full object-contain"
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black bg-opacity-60 rounded-full text-white text-sm font-equitan">
              {currentImageIndex + 1} / {currentProject.images.length}
            </div>
          </div>
        </div>
      )}

      <div
        ref={overlayRef}
        className="fixed left-0 top-0 w-[70%] md:w-1/2 h-full z-20 bg-white overflow-hidden"
        style={{ borderRight: "1px solid #e5e5e5" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 z-30 group"
          aria-label="Close"
        >
          <span className="text-[10px] sm:text-xs md:text-sm font-light text-neutral-400 group-hover:text-neutral-900 transition-colors font-equitan">
            Close
          </span>
        </button>

        {/* Content */}
        <div
          ref={contentRef}
          className="h-full overflow-y-auto px-2 py-3 sm:px-4 sm:py-6 md:px-10 md:py-12 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Hero Header */}
          <div className="mb-2 sm:mb-4 md:mb-8 animate-in">
            <h1 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 font-equitan leading-tight">
              Projects
            </h1>
            <p className="text-[10px] sm:text-sm md:text-lg font-light text-neutral-400 font-equitan mt-0.5 sm:mt-1 md:mt-2">
              Selected works & experiments
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex gap-2 sm:gap-4 md:gap-10 mb-2 animate-in pb-2 sm:pb-4 md:pb-8 border-b border-neutral-200">
            <div>
              <p className="text-sm sm:text-xl md:text-3xl font-bold text-neutral-900 font-equitan">
                {PROJECTS.length}+
              </p>
              <p className="text-[8px] sm:text-xs md:text-sm font-light text-neutral-400 font-equitan">
                Projects
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-xl md:text-3xl font-bold text-neutral-400 font-equitan">
                Full Stack
              </p>
              <p className="text-[8px] sm:text-xs md:text-sm font-light text-neutral-400 font-equitan">
                Focus
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-xl md:text-3xl font-bold text-neutral-400 font-equitan">
                2025
              </p>
              <p className="text-[8px] sm:text-xs md:text-sm font-light text-neutral-400 font-equitan">
                Latest
              </p>
            </div>
          </div>

          {/* All Projects */}
          <div className="space-y-4">
            {[...PROJECTS].reverse().map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onImageClick={openImageOverlay}
              />
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
    </>
  );
}

interface Project {
  id: string;
  title: string;
  description: string;
  about: string;
  tech: string[];
  libraries: string[];
  tools: string[];
  year: string;
  repository?: string;
  repositories?: string[];
  website?: string;
  featured?: boolean;
  images?: string[];
}

function ProjectCard({
  project,
  onImageClick,
}: {
  project: Project;
  onImageClick: (project: Project, imageIndex: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const openImageOverlay = (index: number) => {
    onImageClick(project, index);
  };

  useEffect(() => {
    if (!contentRef.current) return;

    if (isExpanded) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isExpanded]);

  return (
    <div className="block group animate-in">
      <div className="py-6 border-b border-neutral-200">
        {/* Main row - Clickable header */}
        <button
          onClick={toggleExpand}
          className="w-full flex items-start justify-between gap-4 text-left group-hover:opacity-80 transition-opacity"
        >
          {/* Year badge */}
          <div className="w-14 flex-shrink-0">
            <span className="text-sm font-light text-neutral-400 font-equitan">
              {project.year}
            </span>
          </div>

          {/* Left - Title and description */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-neutral-900 font-equitan leading-tight">
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

          {/* Right - Dropdown chevron */}
          <svg
            className={`w-5 h-5 text-neutral-400 transition-transform mt-1 flex-shrink-0 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Tech stack preview - Always visible */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 ml-14">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-light text-neutral-700 bg-neutral-100 rounded font-equitan"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Expandable content */}
        <div
          ref={contentRef}
          className="overflow-hidden"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="mt-6 ml-14 space-y-6">
            {/* Project Image Gallery - Facebook-style collage */}
            {project.images && project.images.length > 0 && (
              <div className="w-full">
                {/* Single image */}
                {project.images.length === 1 && (
                  <button
                    onClick={() => openImageOverlay(0)}
                    className="w-full cursor-pointer group"
                  >
                    <img
                      src={`/projectImages/${project.images[0]}`}
                      alt={project.title}
                      className="w-full h-auto object-contain rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                    />
                  </button>
                )}

                {/* Two images */}
                {project.images.length === 2 && (
                  <div className="grid grid-cols-2 gap-2 h-80">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => openImageOverlay(index)}
                        className="cursor-pointer group overflow-hidden h-full"
                      >
                        <img
                          src={`/projectImages/${img}`}
                          alt={`${project.title} - ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Three images - Facebook style */}
                {project.images.length === 3 && (
                  <div className="grid grid-cols-2 gap-2 h-80">
                    {/* First large image */}
                    <button
                      onClick={() => openImageOverlay(0)}
                      className="row-span-2 cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[0]}`}
                        alt={`${project.title} - 1`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </button>

                    {/* Second image */}
                    <button
                      onClick={() => openImageOverlay(1)}
                      className="cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[1]}`}
                        alt={`${project.title} - 2`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </button>

                    {/* Third image */}
                    <button
                      onClick={() => openImageOverlay(2)}
                      className="cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[2]}`}
                        alt={`${project.title} - 3`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </button>
                  </div>
                )}

                {/* Four or more images - 2x2 grid */}
                {project.images.length >= 4 && (
                  <div className="grid grid-cols-2 gap-2 h-80">
                    {/* First image */}
                    <button
                      onClick={() => openImageOverlay(0)}
                      className="cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[0]}`}
                        alt={`${project.title} - 1`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </button>

                    {/* Second image */}
                    <button
                      onClick={() => openImageOverlay(1)}
                      className="cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[1]}`}
                        alt={`${project.title} - 2`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </button>

                    {/* Third image */}
                    <button
                      onClick={() => openImageOverlay(2)}
                      className="cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[2]}`}
                        alt={`${project.title} - 3`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                    </button>

                    {/* Fourth image or more overlay */}
                    <button
                      onClick={() => openImageOverlay(3)}
                      className="relative cursor-pointer group overflow-hidden h-full"
                    >
                      <img
                        src={`/projectImages/${project.images[3]}`}
                        alt={`${project.title} - 4`}
                        className="w-full h-full object-cover rounded-lg border border-neutral-200 shadow-sm group-hover:opacity-90 transition-opacity"
                      />
                      {project.images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg group-hover:bg-opacity-50 transition-all">
                          <span className="text-white text-3xl font-bold font-equitan">
                            +{project.images.length - 4}
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* About Section */}
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-equitan mb-2">
                About
              </h4>
              <p className="text-sm font-light text-neutral-600 font-equitan leading-relaxed">
                {project.about}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-equitan mb-2">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-light text-neutral-700 bg-neutral-100 rounded font-equitan"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Libraries */}
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-equitan mb-2">
                Libraries
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.libraries.map((lib) => (
                  <span
                    key={lib}
                    className="px-3 py-1 text-xs font-light text-neutral-700 bg-neutral-100 rounded font-equitan"
                  >
                    {lib}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-equitan mb-2">
                Tools Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-xs font-light text-neutral-700 bg-neutral-100 rounded font-equitan"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Section */}
            {(project.repository ||
              project.repositories ||
              project.website) && (
              <div className="flex flex-wrap gap-4">
                {project.repository && (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-light text-neutral-900 hover:text-neutral-600 font-equitan transition-colors group/link"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span>View Repository</span>
                    <svg
                      className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
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
                  </a>
                )}
                {project.repositories &&
                  project.repositories.map((repo, index) => {
                    const isHuggingFace = repo.includes("huggingface.co");
                    const getRepoLabel = () => {
                      if (isHuggingFace) return "OCR Service";
                      if (project.repositories!.length === 2) {
                        return index === 0
                          ? "Backend Repository"
                          : "Frontend Repository";
                      }
                      if (project.repositories!.length === 3) {
                        if (index === 0) return "Frontend Repository";
                        if (index === 1) return "Backend Repository";
                        return "OCR Service";
                      }
                      return `Repository ${index + 1}`;
                    };
                    return (
                      <a
                        key={index}
                        href={repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-light text-neutral-900 hover:text-neutral-600 font-equitan transition-colors group/link"
                      >
                        {isHuggingFace ? (
                          <Fullscreen className="w-5 h-5" />
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        )}
                        <span>{getRepoLabel()}</span>
                        <svg
                          className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
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
                      </a>
                    );
                  })}
                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-light text-neutral-900 hover:text-neutral-600 font-equitan transition-colors group/link"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-globe-icon lucide-globe"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    <span>Visit Website</span>
                    <svg
                      className="w-4 h-4 group-hover/link:translate-x-1 transition-transform"
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
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
