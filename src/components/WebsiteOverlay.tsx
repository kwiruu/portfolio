import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
const KING_PIECE_MODEL = new URL("../assets/king-piece.glb", import.meta.url)
  .href;
import * as THREE from "three";

import KLogo from "../assets/k-logo.svg";

const TARGET_SCALE = 4;

function KingPiece({
  mousePos,
  position = [0, 0, 0],
  startIntro = false,
  onExit,
}: {
  mousePos: { x: number; y: number };
  position?: [number, number, number];
  startIntro?: boolean;
  onExit?: () => void;
}) {
  const { scene } = useGLTF(KING_PIECE_MODEL);
  const meshRef = useRef<THREE.Group>(null);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  // Intro animation triggered by prop
  useEffect(() => {
    if (!meshRef.current || hasPlayedIntro || !startIntro) return;

    const timeline = gsap.timeline({
      onComplete: () => setHasPlayedIntro(true),
    });

    timeline
      .from(meshRef.current.rotation, {
        y: Math.PI * 1,
        x: Math.PI * 0.1,
        z: Math.PI * 0,
        duration: 1,
        ease: "power3.out",
      })
      .fromTo(
        meshRef.current.scale,
        {
          x: TARGET_SCALE * 0.3,
          y: TARGET_SCALE * 0.3,
          z: TARGET_SCALE * 0.3,
        },
        {
          x: TARGET_SCALE,
          y: TARGET_SCALE,
          z: TARGET_SCALE,
          duration: 1.2,
          ease: "back.out(1.6)",
        },
        "<"
      );
  }, [hasPlayedIntro, startIntro]);

  // Exit animation when onExit is called
  useEffect(() => {
    if (!onExit || !meshRef.current) return;

    const handleExit = () => {
      const timeline = gsap.timeline();

      timeline
        // Reset rotation to original position
        .to(
          meshRef.current!.rotation,
          {
            y: 0,
            x: 0,
            z: 0,
            duration: 0.6,
            ease: "power2.inOut",
          },
          0
        )
        // Move piece away (towards camera in Z)
        .to(
          meshRef.current!.position,
          {
            z: 3,
            duration: 0.8,
            ease: "power2.in",
          },
          0
        );
    };

    // Store the ref to call later
    (
      meshRef.current as THREE.Group & { exitAnimation?: () => void }
    ).exitAnimation = handleExit;
  }, [onExit]);

  // Mouse movement animation
  useEffect(() => {
    if (!meshRef.current || !hasPlayedIntro) return;

    gsap.to(meshRef.current.rotation, {
      y: -mousePos.x * 1,
      x: -mousePos.y * 1,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [mousePos, hasPlayedIntro]);

  return <primitive ref={meshRef} object={scene} position={position} />;
}

export default function WebsiteOverlay() {
  const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";
  const viewMode = useStore((state) => state.viewMode);
  const startTour = useStore((state) => state.startTour);
  const enterFPSMode = useStore((state) => state.enterFPSMode);
  const hasPlayedTour = useStore((state) => state.hasPlayedTour);
  const setShowLandscapePrompt = useStore(
    (state) => state.setShowLandscapePrompt
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isNearPiece, setIsNearPiece] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [chessIntroStart, setChessIntroStart] = useState(false);
  const [pieceReady, setPieceReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const kingPieceRef = useRef<THREE.Group & { exitAnimation?: () => void }>(
    null
  );
  const devAutoStartRef = useRef(false);

  // If DEV_MODE is true, skip website overlay and start tour/FPS immediately
  useEffect(() => {
    if (!DEV_MODE) return;
    if (devAutoStartRef.current) return;
    devAutoStartRef.current = true;

    // If tour already played once, jump straight to FPS; else run tour
    if (hasPlayedTour) {
      enterFPSMode();
    } else {
      startTour();
    }
  }, [DEV_MODE, hasPlayedTour, enterFPSMode, startTour]);

  // Intro sequence animation
  useEffect(() => {
    if (viewMode !== "WEBSITE_MODE") return;
    if (introComplete) return;

    const timeline = gsap.timeline({
      onComplete: () => setIntroComplete(true),
    });

    timeline
      // Logo fade in
      .fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
      )
      .to(logoRef.current, {
        opacity: 1,
        duration: 1,
      })
      // Logo fade out
      .to(logoRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "power2.in",
      })
      // First text fade in
      .fromTo(
        text1Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      .to(text1Ref.current, {
        opacity: 1,
        duration: 1,
      })
      // First text fade out
      .to(text1Ref.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power2.in",
      })
      // Second text fade in
      .fromTo(
        text2Ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      )
      .to(text2Ref.current, {
        opacity: 1,
        duration: 1,
      })
      // Second text fade out
      .to(text2Ref.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power2.in",
      })
      // Trigger chess piece intro
      .call(() => setChessIntroStart(true))
      // Main content fade in
      .fromTo(
        mainContentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" }
      )
      // Wait for chess piece intro to complete
      .call(() => {
        setTimeout(() => setPieceReady(true), 1200);
      });
  }, [viewMode, introComplete]);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (viewMode === "WEBSITE_MODE") {
      // Fade in overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
      });
      // Release any pointer lock when returning to website mode
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } else {
      // Fade out overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.5,
      });
    }
  }, [viewMode]);

  // Check if mobile portrait
  const checkIsMobilePortrait = () => {
    const touchCapable =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const smallScreen = window.innerWidth <= 1024 || window.innerHeight <= 768;
    const uaMobile =
      /Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const isMobile = touchCapable || coarse || smallScreen || uaMobile;
    const isPortrait = window.innerHeight > window.innerWidth;
    return isMobile && isPortrait;
  };

  // Handle chess piece click with transition
  const handlePieceClick = () => {
    if (!pieceReady || isTransitioning) return;

    // On mobile portrait, show landscape prompt instead
    if (checkIsMobilePortrait()) {
      setShowLandscapePrompt(true);
      return;
    }

    setIsTransitioning(true);

    // Trigger exit animation on chess piece
    if (kingPieceRef.current?.exitAnimation) {
      kingPieceRef.current.exitAnimation();
    }

    // Fade out overlay and start guided tour (only first time), else jump to FPS
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        if (hasPlayedTour) {
          enterFPSMode();
        } else {
          startTour();
        }
        setIsTransitioning(false);
      },
    });
  };

  // Track mouse movement for parallax effect and proximity detection
  useEffect(() => {
    if (viewMode !== "WEBSITE_MODE") return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = -(e.clientX / window.innerWidth - 0.5) * 3;
      const y = -(e.clientY / window.innerHeight - 0.5) * 3;
      setMousePos({ x, y });

      // Calculate distance from center (king piece position)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Check if cursor is near the piece (within 250px)
      setIsNearPiece(distance < 250);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [viewMode]);

  return (
    <div
      ref={overlayRef}
      className="overlay fixed inset-0 z-10 flex items-center justify-center overflow-hidden text-black bg-white"
      style={{
        opacity: viewMode === "WEBSITE_MODE" ? 1 : 0,
        pointerEvents: viewMode === "WEBSITE_MODE" ? "auto" : "none",
        perspective: "1000px",
        // Remove cursor: none to show native cursor
      }}
    >
      {/* Intro Sequence */}
      {!introComplete && (
        <>
          {/* Logo Screen */}
          <div
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0 }}
          >
            <img
              src={KLogo}
              alt="K Logo"
              className="w-32 h-32"
              draggable={false}
            />
          </div>

          {/* First Text */}
          <div
            ref={text1Ref}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0 }}
          >
            <h2 className="text-4xl font-equitan font-bold text-black font-">
              Hi, I'm Keiru
            </h2>
          </div>

          {/* Second Text */}
          <div
            ref={text2Ref}
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: 0 }}
          >
            <h2 className="text-3xl font-equitan font-light text-black">
              Welcome to my portfolio
            </h2>
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        ref={mainContentRef}
        className="absolute inset-0"
        style={{ opacity: 0 }}
      >
        {/* 3D King Piece in center - non-clickable canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
            <Environment preset="studio" />
            <ambientLight intensity={1.5} />
            <directionalLight
              position={[2, 3, 2]}
              intensity={4}
              color="#ffffff"
              castShadow
            />
            <directionalLight
              position={[-2, 2, 2]}
              intensity={3}
              color="#ffffff"
            />
            <spotLight
              position={[0, 2, 2]}
              angle={1}
              penumbra={0.2}
              intensity={6}
              color="#ffffff"
              castShadow
            />
            <pointLight position={[1, 0.5, 2]} intensity={3} color="#ffffff" />
            <pointLight position={[-1, 0.5, 2]} intensity={3} color="#ffffff" />
            <pointLight
              position={[0, -0.5, 2]}
              intensity={2.5}
              color="#ffffff"
            />
            <KingPiece
              mousePos={mousePos}
              position={[0, -0.9, 0]}
              startIntro={chessIntroStart}
            />
          </Canvas>
        </div>

        {/* Clickable area only around chess piece */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full z-20 ${
            pieceReady && !isTransitioning ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={handlePieceClick}
          style={{
            pointerEvents: pieceReady && !isTransitioning ? "auto" : "none",
          }}
        />

        {/* Bottom text that appears when near piece */}
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: isNearPiece ? 1 : 0,
          }}
        >
          <div className="text-[var(--grayz)] font-inter text-sm">
            PRESS TO START
          </div>
        </div>

        <div className="fixed bottom-3 left-3 justify-center pointer-events-none">
          {/* K-logo SVG centered from assets */}
          <img
            src={KLogo}
            alt="K Logo"
            className="w-12 h-12"
            draggable={false}
          />
        </div>
        <div className="text-right fixed bottom-5 right-5 flex flex-col space-y-0">
          <h1 className="font-bold text-sm text-[var(--grayz)] h-4 font-equitan">
            Keiru Cabili
          </h1>
          <p className="text-muted-foreground text-[9px] font-light font-inter">
            ©2004-2025
          </p>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload(KING_PIECE_MODEL);
