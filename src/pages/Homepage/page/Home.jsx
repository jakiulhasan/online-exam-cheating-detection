import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Eye,
  Layers3,
  Zap,
  ArrowRight,
  BrainCircuit,
  ScanSearch,
  Target,
  Maximize,
  Target as TargetIcon,
} from "lucide-react";

const Home = () => {
  // Custom Animations for Smooth Fades
  const heroText = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const featureCard = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const floating = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    // MAIN CONTAINER: Added noise texture background
    <div className="min-h-screen bg-base-100 text-base-content font-sans antialiased overflow-x-hidden relative selection:bg-accent selection:text-accent-content">
      <div className="absolute inset-0 z-0 opacity-10 bg-noise-pattern pointer-events-none"></div>

      {/* 1. GLASSMORPHIC NAVBAR SECTION */}
      <div className="navbar bg-base-100/50 backdrop-blur-xl sticky top-0 z-50 px-4 lg:px-12 border-b border-base-200/50">
        <div className="navbar-start">
          <a className="btn btn-ghost text-2xl font-black flex items-center gap-3 tracking-tighter group">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary transition-all group-hover:scale-110 group-hover:rotate-6 shadow-inner">
              <ShieldCheck className="w-7 h-7 fill-primary/10" />
            </div>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MedhaGuard
            </span>
          </a>
        </div>
        <div className="navbar-center hidden lg:flex bg-base-200/50 p-1.5 rounded-full border border-base-300 shadow-inner">
          <ul className="menu menu-horizontal menu-sm gap-1 px-1 font-semibold text-base-content/90">
            <li>
              <a className="rounded-full hover:bg-base-300 transition-all">
                Hub
              </a>
            </li>
            <li>
              <a className="rounded-full hover:bg-base-300 transition-all">
                Capabilities
              </a>
            </li>
            <li>
              <a className="rounded-full hover:bg-base-300 transition-all">
                Integrations
              </a>
            </li>
            <li>
              <a className="rounded-full hover:bg-base-300 transition-all">
                Case Studies
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end gap-3.5">
          <button className="btn btn-ghost btn-sm font-bold text-base-content/80 rounded-xl">
            Portal
          </button>
          <button className="btn btn-primary btn-sm md:btn-md shadow-2xl shadow-primary/30 rounded-xl group relative overflow-hidden">
            <span className="relative z-10">Request Access</span>
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      {/* 2. MODERN HERO SECTION WITH ASYMMETRIC ELEMENTS & GLOWS */}
      <div className="hero min-h-screen px-4 lg:px-12 relative -mt-16 overflow-hidden">
        {/* Deep Glowing Background Elements */}
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-80"></div>
        <div className="absolute bottom-10 right-20 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[150px] pointer-events-none opacity-80"></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none opacity-80"></div>

        <div className="hero-content text-center max-w-5xl flex-col z-10 pt-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="badge badge-lg border-primary/20 text-primary gap-2.5 py-5 px-6 mb-6 text-xs font-black uppercase tracking-widest bg-primary/5 rounded-full shadow-inner"
          >
            <BrainCircuit className="w-4 h-4 text-secondary animate-pulse" />{" "}
            The Next-Generation MERN Proctoring Suite
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={heroText}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1] mb-6 relative"
          >
            Aura-Locked <br />
            <span className="bg-gradient-to-br from-primary via-secondary via-accent to-primary bg-clip-text text-transparent bg-[size:300%] animate-gradient-flow relative">
              Academic Trust
            </span>
            {/* Visual Underline/Decorator */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-accent rounded-full opacity-50"></span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="py-4 text-base-content/70 max-w-3xl text-lg sm:text-2xl leading-relaxed font-medium mb-10"
          >
            MedhaGuard integrates advanced, real-time AI computer vision models
            directly into your MERN environment. From eye-movement tracking to
            device detection, we secure the future of fair evaluation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 w-full justify-center items-center"
          >
            <button className="btn btn-primary btn-md md:btn-lg shadow-3xl shadow-primary/30 group rounded-2xl px-12 text-base font-bold">
              Activate Guard
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button className="btn btn-outline border-base-300 btn-md md:btn-lg hover:bg-base-200 rounded-2xl px-10 text-base font-semibold group">
              <Zap className="w-5 h-5 text-accent opacity-70 group-hover:opacity-100 transition-opacity" />{" "}
              View AI Capabilities
            </button>
          </motion.div>

          {/* ADDED HERO FOOTER Visual Element - Asymmetric shape with noise */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute -bottom-1 left-0 w-full z-0 h-40 bg-gradient-to-t from-base-100 to-transparent"
          >
            <div className="w-[120%] h-full bg-base-200/50 -rotate-3 -translate-x-10 translate-y-20 border-t-2 border-base-300 rounded-[50%] blur-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-noise-pattern"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. CAPABILITIES / FEATURES SECTION - ADDED NEW MODERN LAYOUT */}
      <div className="py-32 px-4 lg:px-12 max-w-7xl mx-auto relative">
        <div className="text-center mb-24 relative z-10">
          <div className="p-3 bg-secondary/10 rounded-3xl w-fit mx-auto mb-5 border border-secondary/20 shadow-inner">
            <ScanSearch className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5">
            Digital Integrity Ecosystem
          </h2>
          <p className="text-base-content/60 max-w-2xl mx-auto text-base md:text-lg">
            MedhaGuard leverages deep learning to detect over{" "}
            <strong className="text-accent">
              30+ unique suspicion vectors
            </strong>{" "}
            simultaneously.
          </p>
        </div>

        {/* Feature Grid - Non-traditional 3D like cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Capability Card 1: Eye & Face Tracking */}
          <motion.div
            variants={featureCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="card bg-base-200 border border-base-300/60 shadow-inner rounded-3xl group overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] bg-noise-pattern"></div>
            <div className="card-body p-9 relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-md">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="card-title mt-6 text-2xl font-extrabold tracking-tight">
                AI Gaze Analysis
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed mb-4">
                Continuous eye-tracking models detect eye movement patterns,
                fixation deviations, and rapid gaze shifts away from the exam
                interface.
              </p>
              <div className="w-fit h-fit p-1 px-3 border border-primary/20 rounded-full text-xs font-black tracking-wider text-primary bg-primary/5 uppercase group-hover:bg-primary/10 transition-colors">
                Computer Vision
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl group-hover:scale-125 transition-transform"></div>
          </motion.div>

          {/* Capability Card 2: Device & Object Detection */}
          <motion.div
            variants={featureCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="card bg-base-200 border border-base-300/60 shadow-inner rounded-3xl group overflow-hidden lg:translate-y-10"
          >
            <div className="absolute inset-0 opacity-[0.03] bg-noise-pattern"></div>
            <div className="card-body p-9 relative z-10">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-md">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="card-title mt-6 text-2xl font-extrabold tracking-tight">
                Unauthorized Device Hunt
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed mb-4">
                Integrated YOLO models run inference instantly on the
                client-side browser to detect phones, second monitors, or
                reference materials.
              </p>
              <div className="w-fit h-fit p-1 px-3 border border-secondary/20 rounded-full text-xs font-black tracking-wider text-secondary bg-secondary/5 uppercase group-hover:bg-secondary/10 transition-colors">
                Real-time Inference
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl group-hover:scale-125 transition-transform"></div>
          </motion.div>

          {/* Capability Card 3: Multi-Face/Body */}
          <motion.div
            variants={featureCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card bg-base-200 border border-base-300/60 shadow-inner rounded-3xl group overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.03] bg-noise-pattern"></div>
            <div className="card-body p-9 relative z-10">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-md">
                <ScanSearch className="w-8 h-8" />
              </div>
              <h3 className="card-title mt-6 text-2xl font-extrabold tracking-tight">
                Ecosystem Presence
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed mb-4">
                Verifies continuously if the same student is present, and logs
                any additional faces or body movements detected in the
                candidate's workspace.
              </p>
              <div className="w-fit h-fit p-1 px-3 border border-accent/20 rounded-full text-xs font-black tracking-wider text-accent bg-accent/5 uppercase group-hover:bg-accent/10 transition-colors">
                Face Re-Auth
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl group-hover:scale-125 transition-transform"></div>
          </motion.div>
        </div>
      </div>

      {/* 4. MODERNISED LIVE INTEGRATION SCREEN (ADMIN PANEL) - Increased Contrast & Glassmorphism */}
      <div className="py-24 px-4 lg:px-12 max-w-7xl mx-auto relative">
        <div className="absolute top-10 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
        <div className="card lg:card-side bg-neutral/80 backdrop-blur-2xl text-neutral-content shadow-3xl overflow-hidden border border-neutral-focus/50 rounded-3xl relative z-10 group">
          <div className="absolute inset-0 z-0 opacity-[0.04] bg-noise-pattern"></div>

          <div className="card-body lg:w-5/12 justify-center p-10 lg:p-16 relative z-10">
            <div className="badge badge-accent badge-lg gap-1.5 mb-4 font-black text-xs uppercase tracking-widest py-3 px-5 border border-accent/20 bg-accent/5 rounded-full shadow-inner">
              MERN Synchronization
            </div>
            <h2 className="card-title text-4xl md:text-5xl font-black text-white leading-tight mb-5 tracking-tighter">
              AuraAdmin <br /> Dash Control
            </h2>
            <p className="text-neutral-content/70 text-base md:text-lg leading-relaxed mb-9">
              Experience dynamic integrity management. MedhaGuard utilizes
              WebSockets via Socket.IO in the MERN backend to instantly pipe
              violation screenshots, eye-tracking heatmaps, and suspicion logs
              directly to this administrative interface.
            </p>
            <div className="card-actions justify-start">
              <button className="btn btn-primary rounded-xl px-8 shadow-2xl shadow-primary/30 group relative overflow-hidden font-bold">
                <span className="relative z-10">View Integration Specs</span>
                <div className="absolute inset-0 bg-accent translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          {/* Mockup Display - Glassmorphism Terminal */}
          <div className="lg:w-7/12 bg-base-300/10 p-8 lg:p-12 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-neutral-focus/30 relative z-10 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-noise-pattern"></div>
            {/* Floating Shapes */}
            <motion.div
              animate={floating}
              className="absolute -top-10 -left-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl"
            ></motion.div>
            <motion.div
              animate={floating}
              className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"
            ></motion.div>

            <div className="mockup-window border border-neutral-focus/50 bg-neutral/60 backdrop-blur-xl w-full shadow-3xl rounded-2xl relative">
              <div className="absolute top-2.5 right-4 badge badge-neutral badge-xs opacity-50 font-mono">
                /dev/medha-aura
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-neutral text-[10.5px] font-mono text-neutral-content/90 min-h-[300px]">
                {/* Visual Feedback Mocks */}
                <div className="bg-neutral-focus p-4 rounded-xl flex flex-col items-center justify-center text-center border border-base-content/5 relative group/card">
                  <div className="absolute top-2 right-2 badge badge-success badge-sm border-0 font-bold px-2 rounded-md">
                    OK
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-neutral/50 flex items-center justify-center mb-3 text-success group-hover/card:scale-110 transition-transform">
                    <TargetIcon className="w-7 h-7" />
                  </div>
                  <div className="text-[11px] font-bold">Candidate: #A7C2</div>
                  <div className="opacity-60 mt-1">
                    Liveness: CONFIRMED (99.1%)
                  </div>
                </div>

                <div className="bg-error/5 p-4 rounded-xl flex flex-col items-center justify-center text-center border border-error/20 relative group/card animate-pulse">
                  <div className="absolute top-2 right-2 badge badge-error badge-sm border-0 font-bold px-2 rounded-md animate-pulse">
                    FLAGGED
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mb-3 text-error group-hover/card:scale-110 transition-transform">
                    <Maximize className="w-7 h-7" />
                  </div>
                  <div className="text-[11px] font-bold text-error">
                    Candidate: #B439
                  </div>
                  <div className="text-error opacity-80 mt-1">
                    Violation: EYE_GAZE_SKEW (73%)
                  </div>
                </div>

                {/* Terminal Stream */}
                <div className="bg-neutral-focus/60 p-4 rounded-xl text-[10px] font-mono text-neutral-content/80 md:col-span-2 space-y-2 border border-base-content/5">
                  <div className="text-success">
                    [medha-ai]: Connection established. Port 8080 active.
                  </div>
                  <div className="text-warning">
                    [WARN]: Heatmap skew threshold exceeded (#B439). Sending
                    screenshot.
                  </div>
                  <div className="text-info">
                    [sync]: Admin log updated (Ref ID: 9382).
                  </div>
                  <div className="opacity-30 mt-3">
                    // Waiting for real-time Aura events...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER SECTION - Glassmorphism, increased height & separation */}
      <footer className="footer footer-center p-10 py-16 bg-base-200 text-base-content border-t border-base-300 relative rounded-t-[50px] mt-16 shadow-inner overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-noise-pattern z-0"></div>
        <div className="relative z-10">
          <a className="btn btn-ghost text-3xl font-black flex items-center gap-3 tracking-tighter mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
              <ShieldCheck className="w-8 h-8 fill-primary/10" />
            </div>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MedhaGuard App
            </span>
          </a>
          <p className="max-w-md text-base-content/60 leading-relaxed text-center mb-10">
            Pioneering digital trust through state-of-the-art AI integrity
            ecosystems. Secure your examinations with foolproof, real-time
            computerized proctoring.
          </p>
          <div className="grid grid-flow-col gap-6 text-sm font-semibold opacity-80 mb-6">
            <a className="link link-hover">Capabilities</a>
            <a className="link link-hover">MERN Integration</a>
            <a className="link link-hover">Compliance</a>
            <a className="link link-hover">Contact</a>
          </div>
          <div className="text-[11px] opacity-40 font-mono tracking-wide mt-10">
            © 2026 MEDHAGUARD AURA-TECHNOLOGIES. BEYOND COMPROMISE. v1.2-ALPHA
          </div>
        </div>
      </footer>

      {/* Modern Tailwind Plugin: Custom Utility for Gradient Flow & Noise */}
      <style>{`
        @keyframes gradient-flow {
          0% { bg-position: 0% 50%; }
          50% { bg-position: 100% 50%; }
          100% { bg-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 6s ease repeat-infinite;
        }
        .bg-noise-pattern {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3%3E");
        }
        /* Custom shadows for modern floating look */
        .shadow-3xl {
            shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.4);
        }
        .shadow-primary\/30 {
            shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Home;
