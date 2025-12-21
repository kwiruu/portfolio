import { useEffect, useRef, useCallback, useState } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
// MUI Timeline imports
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

// Import profile image
import profileImage from "../assets/me.png";
import citLogo from "../assets/education/citlogo.png";
import dvrmLogo from "../assets/education/DVRMNHSlogo.png";
import jobtarget from "../assets/education/jobtarget.png";
import rizwoodsLogo from "../assets/education/rizwoods.png";
import ucmetcLogo from "../assets/education/ucmetc.png";

// Pixel art gallery
import artFrieren from "../assets/arts/floating-frieren-192562.gif";
import artPelageya from "../assets/arts/pelageya-sergeyevna-467318.gif";
import artSylphiette from "../assets/arts/sylphiette-575796.gif";

type LinkedInWindow = Window & { LIRenderAll?: () => void };

const PIXEL_ARTS = [
  { src: artFrieren, title: "Floating Frieren" },
  { src: artPelageya, title: "Pelageya Sergeyevna" },
  { src: artSylphiette, title: "Sylphiette" },
];

// Career & education timeline
const TIMELINE = [
  {
    year: "2024 - Present",
    title: "Software Developer Intern",
    org: "Talleco JobTarget Inc.",
    location: "Cebu City, Philippines",
  },
  {
    year: "2021 - Present",
    title: "Bachelor of Science in Computer Science",
    org: "Cebu Institute of Technology - University",
    location: "Cebu City, Philippines",
  },
  {
    year: "2019 - 2021",
    title: "Senior High School - STEM",
    org: "Cebu Institute of Technology - University",
    location: "Cebu City, Philippines",
  },
  {
    year: "2018 - 2019",
    title: "Junior High School",
    org: "Don Vicente Rama Memorial National High School",
    location: "Cebu City, Philippines",
  },
  {
    year: "2016 - 2018",
    title: "Junior High School",
    org: "Rizwoods Colleges",
    location: "Cebu City, Philippines",
  },
  {
    year: "2015 - 2016",
    title: "Junior High School",
    org: "University of Cebu - METC",
    location: "Cebu City, Philippines",
  },
  {
    year: "2012 - 2015",
    title: "Elementary School",
    org: "Don Vicente Rama Memorial Elementary School",
    location: "Cebu City, Philippines",
  },
];

const TIMELINE_LOGOS: Record<string, string> = {
  "Cebu Institute of Technology - University": citLogo,
  "Don Vicente Rama Memorial National High School": dvrmLogo,
  "Talleco JobTarget Inc.": jobtarget,
  "Rizwoods Colleges": rizwoodsLogo,
  "University of Cebu - METC": ucmetcLogo,
  "Don Vicente Rama Memorial Elementary School": dvrmLogo,
};

// Timeline component using MUI
function HistoryTimeline() {
  return (
    <Timeline position="right">
      {TIMELINE.map((entry, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{
              maxWidth: "120px",
              paddingRight: 2,
              paddingTop: 3,
              fontSize: "0.75rem",
              color: "#000000",
            }}
          >
            {entry.year}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#f8fafc",
                boxShadow: "0 0 0 4px white, 0 0 0 5px #f8fafc",
                p: 0,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {TIMELINE_LOGOS[entry.org] && (
                <img
                  src={TIMELINE_LOGOS[entry.org]}
                  alt={`${entry.org} logo`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </TimelineDot>
            {index !== TIMELINE.length - 1 && (
              <TimelineConnector sx={{ bgcolor: "#e5e5e5" }} />
            )}
          </TimelineSeparator>
          <TimelineContent sx={{ paddingLeft: 2 }}>
            <div className="mb-4">
              <h3 className="text-base font-bold text-neutral-900 font-equitan mb-1">
                {entry.title}
              </h3>
              <p className="text-sm font-medium text-neutral-700 font-equitan">
                {entry.org}
              </p>
              <p className="text-xs text-neutral-500 font-equitan">
                {entry.location}
              </p>
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

// Hobbies data
const HOBBIES = [
  { name: "Pixel Art", link: "https://lospec.com/kwiruu" },
  { name: "Gym" },
  { name: "Gaming" },
  { name: "Coding" },
  { name: "Music" },
  { name: "Learning" },
];

// Social links
const SOCIALS = [
  {
    name: "GitHub",
    url: "https://github.com/kwiruu",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/keirucabili",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "X",
    url: "https://x.com/keirucabili",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Email",
    url: "mailto:keiruvent.cabili@gmail.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const PHONE_NUMBER = "+63 998 164 6964";

export default function AboutOverlay() {
  const viewMode = useStore((state) => state.viewMode);
  const splitModeContent = useStore((state) => state.splitModeContent);
  const exitSplitMode = useStore((state) => state.exitSplitMode);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

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

    if (viewMode === "SPLIT_MODE" && splitModeContent === "about") {
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
    if (viewMode !== "SPLIT_MODE" || splitModeContent !== "about") return;

    const linkedInScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://platform.linkedin.com/badges/js/profile.js"]'
    );

    const renderBadge = () => {
      (window as LinkedInWindow).LIRenderAll?.();
    };

    if (linkedInScript) {
      if ((window as LinkedInWindow).LIRenderAll) {
        renderBadge();
      } else {
        linkedInScript.addEventListener("load", renderBadge);
        return () => linkedInScript.removeEventListener("load", renderBadge);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    script.onload = renderBadge;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [viewMode, splitModeContent]);

  useEffect(() => {
    if (viewMode !== "SPLIT_MODE" || splitModeContent !== "about") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, splitModeContent, handleClose]);

  if (viewMode !== "SPLIT_MODE" || splitModeContent !== "about") return null;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 1500);
    } catch (err) {
      console.error("Failed to copy phone number", err);
    }
  };

  return (
    <TooltipProvider>
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
          {/* Hero Header with Profile Image */}
          <div className="mb-2 sm:mb-4 md:mb-8 animate-in flex items-center gap-2 sm:gap-3 md:gap-6">
            <div className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24">
              <img
                src={profileImage}
                alt="Keiru Cabili"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 font-equitan leading-tight">
                Keiru Cabili
              </h1>
              <p className="text-[10px] sm:text-sm md:text-lg font-light text-neutral-400 font-equitan mt-0.5 sm:mt-1 md:mt-2">
                Full Stack Developer • Cloud Enthusiast
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-2 sm:gap-4 md:gap-10 mb-2 sm:mb-4 md:mb-8 animate-in pb-2 sm:pb-4 md:pb-8 border-b border-neutral-200">
            <div>
              <p className="text-sm sm:text-xl md:text-3xl font-bold text-neutral-900 font-equitan">
                4th Year
              </p>
              <p className="text-[8px] sm:text-xs md:text-sm font-light text-neutral-400 font-equitan">
                CS Student
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-xl md:text-3xl font-bold text-neutral-400 font-equitan">
                CIT-U
              </p>
              <p className="text-[8px] sm:text-xs md:text-sm font-light text-neutral-400 font-equitan">
                University
              </p>
            </div>
            <div>
              <p className="text-sm sm:text-xl md:text-3xl font-bold text-neutral-400 font-equitan">
                Full Stack
              </p>
              <p className="text-[8px] sm:text-xs md:text-sm font-light text-neutral-400 font-equitan">
                Expertise
              </p>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-8 animate-in">
            <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-4">
              Hello!
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-light text-neutral-600 font-equitan leading-relaxed">
                I'm a fourth-year Computer Science student at Cebu Institute of
                Technology – University and a full stack developer who loves
                designing and building web applications. I constantly explore
                new technologies to sharpen my skills and often turn curiosity
                into shipped projects.
              </p>
              <p className="text-sm font-light text-neutral-600 font-equitan leading-relaxed">
                I'm a team player who thrives in collaborative environments and
                enjoys solving complex problems with others. I aspire to become
                a DevOps Engineer, building on my cloud engineering foundation,
                and I'm passionate about innovation and bringing fresh ideas to
                life.
              </p>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="mb-8 animate-in">
            <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-6">
              Career
            </h2>
            <HistoryTimeline />
          </div>

          {/* Hobbies Section */}
          <div className="mb-8 animate-in">
            <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-4">
              Hobbies & Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {HOBBIES.map((hobby) =>
                hobby.link ? (
                  <a
                    key={hobby.name}
                    href={hobby.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-light text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors font-equitan"
                  >
                    {hobby.name}
                  </a>
                ) : (
                  <span
                    key={hobby.name}
                    className="px-4 py-2 text-sm font-light text-neutral-700 bg-neutral-100 rounded-lg font-equitan"
                  >
                    {hobby.name}
                  </span>
                )
              )}
            </div>

            {/* Pixel Art Gallery */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-neutral-700 font-equitan">
                  My Pixel Arts
                </h3>
                <a
                  href="https://lospec.com/kwiruu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-black hover:text-gray-600 font-equitan"
                >
                  View all →
                </a>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PIXEL_ARTS.map((art, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:scale-105 transition-transform cursor-pointer"
                    title={art.title}
                  >
                    <img
                      src={art.src}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connect Section */}
          <div className="mb-8 animate-in">
            <h2 className="text-lg font-bold text-neutral-900 font-equitan mb-4">
              Let's Connect
            </h2>
            <div className="flex flex-col">
              <div className="flex gap-3">
                {SOCIALS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 hover:text-neutral-900 transition-all"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopyPhone}
                      className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 transition-all"
                      aria-label="Copy phone number"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-phone-icon lucide-phone"
                      >
                        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    <span className="text-sm font-equitan">
                      {copiedPhone ? "Copied!" : "Copy number"}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row">
                <div>
                  <div
                    className="badge-base LI-profile-badge"
                    data-locale="en_US"
                    data-size="large"
                    data-theme="light"
                    data-type="HORIZONTAL"
                    data-vanity="keirucabili"
                    data-version="v1"
                  >
                    <a
                      className="badge-base__link LI-simple-link"
                      href="https://ph.linkedin.com/in/keirucabili?trk=profile-badge"
                    >
                      Keiru Cabili
                    </a>
                  </div>
                </div>
                <div className="flex-1 rounded-xl border bg-gray-950 shadow-sm overflow-hidden h-min mt-6 max-w-80">
                  <div className="flex items-center gap-2 bg-gray-900 px-4 py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#ffffff"
                      className="w-7 h-7 text-neutral-800"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xl font-semibold text-neutral-200 font-equitan pt-0.5">
                      GitHub
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-neutral-600 mx-4 mt-3 mb-2">
                    <img
                      src="https://github.com/kwiruu.png"
                      alt="GitHub avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-3 px-4 pb-5">
                    <div className="flex flex-col justify-center">
                      <p className="text-lg font-semibold text-neutral-200 font-equitan">
                        Keiru Cabili
                      </p>
                      <p className="text-sm text-neutral-500 font-equitan">
                        Software Developer | Aspiring DevSecOps Engineer
                      </p>
                      <p className="text-sm text-neutral-500 font-equitan">
                        kwiruu | Open-source projects & cloud builds
                      </p>
                      <a
                        href="https://github.com/kwiruu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex h-9 w-32 items-center justify-center rounded-full border border-neutral-300 px-4 text-md font-semibold text-neutral-300 transition-colors hover:bg-[#e6f0fb]"
                      >
                        View profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
