import { useEffect, useRef, useCallback, useState } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";

// Certificate images
import isc2Cert from "../assets/certificateImages/isc2.png";
import azureCert from "../assets/certificateImages/azure.png";
import oracleCert from "../assets/certificateImages/oracle.png";
import linuxCert from "../assets/certificateImages/linux.png";
import udemyCert from "../assets/certificateImages/udemy.png";
import awsar from "../assets/certificateImages/awsar.png";
import awsf from "../assets/certificateImages/awsf.png";

// Company logo URLs (using official brand CDNs/URLs)
const LOGOS = {
  isc2: "https://media.licdn.com/dms/image/v2/D4E0BAQEANDNp1O78-g/company-logo_100_100/company-logo_100_100/0/1692269546870?e=1766620800&v=beta&t=06etoVh1DXY6-_qnTRqLgAUCO_7gv1Z8sazfo_T3YWc",
  aws: "https://media.licdn.com/dms/image/v2/D4E0BAQFqdm1TZ-RZKQ/company-logo_100_100/B4EZgOay6gHEAY-/0/1752588562343/amazon_web_services_logo?e=1766620800&v=beta&t=xnKbYM8BEAFSodjeuImyO5vpqn4epwhJFMK9WiHrY8Y",
  oracle:
    "https://media.licdn.com/dms/image/v2/D4E0BAQHYCgYovUuPtQ/company-logo_100_100/company-logo_100_100/0/1665755678957/oracle_logo?e=1766620800&v=beta&t=b71WjRLW7LG5SXhSpwJ7ROIu0kwYC_s2jHHNWrIHl1g",
  microsoft:
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  google:
    "https://media.licdn.com/dms/image/v2/D560BAQFV-ds_iFfVSQ/company-logo_100_100/company-logo_100_100/0/1698660876286?e=1766620800&v=beta&t=W6MsH1e1r2xptNlOzwMyEYgpe6PXwRXwwuzLTkrn-Go",
  linux: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
  zuitt:
    "https://media.licdn.com/dms/image/v2/C560BAQFFcmd6tKsv5Q/company-logo_100_100/company-logo_100_100/0/1630609526598/tuitt_logo?e=1766620800&v=beta&t=oHwg7D8g4CEmjfCh6MwRhK7T3FMAP0_uaVq-K2QT4o4",
  linkedin:
    "https://media.licdn.com/dms/image/v2/C560BAQHaVYd13rRz3A/company-logo_100_100/company-logo_100_100/0/1638831590218/linkedin_logo?e=1766620800&v=beta&t=eOPbKo2R3Y-Sqe5Cf6n17YORrbT2NpKNEna2M8xpYmQ",
  udemy:
    "https://media.licdn.com/dms/image/v2/D560BAQEf_NHzN2yVQg/company-logo_100_100/company-logo_100_100/0/1723593046388/udemy_logo?e=1766620800&v=beta&t=MDQ91-Gf8dlhTSsAgM0g5Dl4-busATcAugZqMixev3A",
  codecademy:
    "https://media.licdn.com/dms/image/v2/D4E0BAQH81kKlXtE0og/company-logo_100_100/company-logo_100_100/0/1720724787444/codecademy_logo?e=1766620800&v=beta&t=4xewklsBsyswG4h__3ZQkOmugV9L8GInVljj90QvzjY",
  codechum:
    "https://media.licdn.com/dms/image/v2/C510BAQGx_-DNtSRFhw/company-logo_100_100/company-logo_100_100/0/1630568170174?e=1766620800&v=beta&t=6nst0-4L3qsnHMPx8gFjQ1UjK7hZEPVek4-oSyFPei8",
};

// Certification data
const CERTIFICATIONS = [
  {
    id: "azure",
    title: "AZURE FUNDAMENTALS",
    shortTitle: "AZ-900",
    issuer: "MICROSOFT",
    date: "MAR 2025",
    logo: LOGOS.microsoft,
    skills: ["Azure", "SaaS", "IaaS", "PaaS"],
    credentialId: "4EACDBD230361567",
    credentialUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/4EACDBD230361567",
    certificateImage: azureCert,
  },
  {
    id: "isc2-cc",
    title: "CERTIFIED IN CYBERSECURITY",
    shortTitle: "CC",
    issuer: "ISC2",
    date: "SEP 2025",
    logo: LOGOS.isc2,
    skills: ["Access Controls", "Network Security", "Incident Response"],
    credentialId: "7c546f61-bc2c-4d9d-a738-5fd51aeeb1d6",
    credentialUrl:
      "https://www.credly.com/badges/7c546f61-bc2c-4d9d-a738-5fd51aeeb1d6",
    certificateImage: isc2Cert,
  },
  {
    id: "aws",
    title: "CLOUD FOUNDATIONS",
    shortTitle: "AWS",
    issuer: "AMAZON WEB SERVICES",
    date: "SEP 2025",
    logo: LOGOS.aws,
    skills: ["Cloud Computing", "AWS", "EC2", "S3"],
    credentialUrl:
      "https://www.credly.com/badges/6cc9deaf-c8f7-4225-924d-7191b5c7b9d9/linked_in_profile",
    certificateImage: awsf,
  },
  {
    id: "aws",
    title: "CLOUD ARCHITECTING",
    shortTitle: "AWS",
    issuer: "AMAZON WEB SERVICES",
    date: "SEP 2025",
    logo: LOGOS.aws,
    skills: [
      "Architecting Solutions On AWS",
      "AWS",
      "EC2",
      "Building Infrastructure On AWS",
    ],
    credentialUrl:
      "https://www.credly.com/badges/c79911b1-1b39-47de-8c8f-fa2a4f79300b",
    certificateImage: awsar,
  },
  {
    id: "oracle",
    title: "OCI 2025 FOUNDATIONS",
    shortTitle: "OCI",
    issuer: "ORACLE",
    date: "SEP 2025",
    logo: LOGOS.oracle,
    skills: ["OCI", "Cloud Computing", "Oracle Cloud"],
    credentialId: "322515041OCI25FNDCFA",
    credentialUrl:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=322515041OCI25FNDCFA",
    certificateImage: oracleCert,
  },
  {
    id: "gcp-essentials",
    title: "CLOUD ESSENTIALS",
    shortTitle: "GCP",
    issuer: "GOOGLE CLOUD",
    date: "JUL 2025",
    logo: LOGOS.google,
    skills: ["GKE", "GCP", "Cloud Run"],
    credentialId: "16939170",
    credentialUrl:
      "https://www.cloudskillsboost.google/public_profiles/16939170",
  },
  {
    id: "kubernetes",
    title: "KUBERNETES IN GOOGLE CLOUD",
    shortTitle: "K8S",
    issuer: "GOOGLE CLOUD",
    date: "JUL 2025",
    logo: LOGOS.google,
    skills: ["Kubernetes", "GKE", "Docker", "Containers"],
    credentialId: "16931396",
    credentialUrl:
      "https://www.cloudskillsboost.google/public_profiles/16931396",
  },
  {
    id: "linux",
    title: "INTRODUCTION TO LINUX",
    shortTitle: "LFS101",
    issuer: "LINUX FOUNDATION",
    date: "JUL 2025",
    logo: LOGOS.linux,
    skills: ["Linux", "CLI", "Shell", "Boot Loaders"],
    certificateImage: linuxCert,
  },
  {
    id: "zuitt",
    title: "TECH CAREER PROGRAM",
    shortTitle: "FULLSTACK",
    issuer: "ZUITT BOOTCAMP",
    date: "APR 2025",
    logo: LOGOS.zuitt,
    skills: ["JavaScript", "DOM", "Full Stack"],
  },
  {
    id: "nodejs",
    title: "RESTFUL APIS WITH NODE.JS",
    shortTitle: "NODE",
    issuer: "LINKEDIN LEARNING",
    date: "JUL 2024",
    logo: LOGOS.linkedin,
    skills: ["REST APIs", "Node.js", "Express.js"],
  },
  {
    id: "react",
    title: "REACT DESIGN PATTERNS",
    shortTitle: "REACT",
    issuer: "LINKEDIN LEARNING",
    date: "JUN 2024",
    logo: LOGOS.linkedin,
    skills: ["Design Patterns", "React.js", "Components"],
  },
  {
    id: "php",
    title: "PHP MASTER CLASS",
    shortTitle: "PHP",
    issuer: "UDEMY",
    date: "JUN 2024",
    logo: LOGOS.udemy,
    skills: ["PHP", "MySQL", "PhpMyAdmin"],
    credentialId: "UC-6d4db55f-8884-4525-ae42-951ea7d2b13e",
    credentialUrl:
      "https://www.udemy.com/certificate/UC-6d4db55f-8884-4525-ae42-951ea7d2b13e",
    certificateImage: udemyCert,
  },
  {
    id: "python",
    title: "PYTHON 3",
    shortTitle: "PY",
    issuer: "CODECADEMY",
    date: "JAN 2024",
    logo: LOGOS.codecademy,
    skills: ["OOP", "Python", "Scripting"],
  },
  {
    id: "javascript",
    title: "JAVASCRIPT",
    shortTitle: "JS",
    issuer: "CODECADEMY",
    date: "JAN 2024",
    logo: LOGOS.codecademy,
    skills: ["JavaScript", "ES6", "DOM"],
  },
  {
    id: "sql",
    title: "SQL",
    shortTitle: "SQL",
    issuer: "CODECADEMY",
    date: "JAN 2024",
    logo: LOGOS.codecademy,
    skills: ["SQL", "Databases", "Queries"],
  },
];

export default function SplitModeOverlay() {
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

    if (viewMode === "SPLIT_MODE" && splitModeContent === "certifications") {
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
    if (viewMode !== "SPLIT_MODE" || splitModeContent !== "certifications")
      return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, splitModeContent, handleClose]);

  if (viewMode !== "SPLIT_MODE" || splitModeContent !== "certifications")
    return null;

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
            Certifications
          </h1>
          <p className="text-lg font-light text-neutral-400 font-equitan mt-2">
            Licenses & professional credentials
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex gap-10 mb-2 animate-in pb-8 border-b border-neutral-200">
          <div>
            <p className="text-3xl font-bold text-neutral-900 font-equitan">
              15+
            </p>
            <p className="text-sm font-light text-neutral-400 font-equitan">
              Certifications
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-400 font-equitan">
              5
            </p>
            <p className="text-sm font-light text-neutral-400 font-equitan">
              Cloud Platforms
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

        {/* All Certifications - Each one big */}
        <CertificationsList />

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

interface Cert {
  id: string;
  title: string;
  shortTitle: string;
  issuer: string;
  date: string;
  logo: string;
  skills: string[];
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
}

function CertificationsList() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  return (
    <>
      <div className="space-y-4">
        {CERTIFICATIONS.map((cert) => (
          <CertCard
            key={cert.id}
            cert={cert}
            onImageClick={(src, title) => setSelectedImage({ src, title })}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors font-equitan text-sm"
            >
              Close
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-center text-white/70 font-equitan font-light text-sm mt-4">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function CertCard({
  cert,
  onImageClick,
}: {
  cert: Cert;
  onImageClick: (src: string, title: string) => void;
}) {
  const Wrapper = cert.credentialUrl ? "a" : "div";
  const wrapperProps = cert.credentialUrl
    ? {
        href: cert.credentialUrl,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className="block group animate-in">
      <div className="py-6 border-b border-neutral-200 group-hover:border-neutral-400 transition-colors">
        {/* Main row */}
        <div className="flex items-start justify-between gap-4">
          {/* Logo */}
          <div className="">
            <img
              src={cert.logo}
              alt={cert.issuer}
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Left - Title and issuer */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900 font-equitan leading-tight group-hover:text-neutral-600 transition-colors">
              {cert.title}
            </h3>
            <p className="text-sm font-light text-neutral-500 font-equitan mt-1">
              {cert.issuer} · {cert.date}
            </p>
            {cert.credentialId && (
              <p className="text-xs font-light text-neutral-400 font-equitan mt-1">
                ID: {cert.credentialId}
              </p>
            )}
          </div>

          {/* Certificate image preview */}
          {cert.certificateImage && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onImageClick(cert.certificateImage!, cert.title);
              }}
              className="w-26 h-16 rounded border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors flex-shrink-0 group/preview"
              title="View certificate"
            >
              <img
                src={cert.certificateImage}
                alt={`${cert.title} certificate`}
                className="w-full h-full object-cover group-hover/preview:scale-105 transition-transform"
              />
            </button>
          )}

          {/* Right - Arrow for links */}
          {cert.credentialUrl && (
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

        {/* Skills row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 ml-14">
          {cert.skills.map((skill, index) => (
            <span
              key={skill}
              className="text-xs font-light text-neutral-400 font-equitan"
            >
              {skill}
              {index < cert.skills.length - 1 && (
                <span className="ml-3 text-neutral-300">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
