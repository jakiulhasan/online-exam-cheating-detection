import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Users,
  GraduationCap,
  ArrowRight,
  LogIn,
  KeyRound,
  Mail,
  Eye,
  MonitorSmartphone,
  Ban,
  Radio,
  Info,
  Network,
  Server,
  Fingerprint,
} from "lucide-react";

const Home = () => {
  // Login Tab State: 'student' or 'teacher'
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="min-h-screen bg-base-100 text-base-content relative font-sans antialiased overflow-x-hidden selection:bg-primary selection:text-primary-content">
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* ================= 1. NAVBAR ================= */}
      <div className="navbar bg-base-100/70 backdrop-blur-md border-b border-base-200/60 px-4 lg:px-12 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="flex items-center gap-2.5 font-black text-xl md:text-2xl tracking-tighter">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary text-primary-content rounded-xl shadow-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">
              MedhaGuard
            </span>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-bold gap-2 text-sm opacity-80">
            <li>
              <a
                href="#gateway"
                className="hover:text-primary transition-all rounded-lg"
              >
                Gateway Portal
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-primary transition-all rounded-lg"
              >
                AI Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-primary transition-all rounded-lg"
              >
                System Spec
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <span className="text-xs font-mono font-bold text-success flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>{" "}
            Node Core: v2.0
          </span>
        </div>
      </div>

      {/* ================= 2. GATEWAY & DYNAMIC LOGIN CONTAINER ================= */}
      <div
        id="gateway"
        className="container mx-auto px-4 lg:px-12 py-12 lg:py-20 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        {/* Left Grid: Left branding and status context */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="badge badge-outline border-primary/30 text-primary gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-full bg-primary/5">
            <Fingerprint className="w-3.5 h-3.5 animate-pulse" /> Secure
            Tokenized Auth
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
            Next-Gen <br />
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent">
              Exam Integrity
            </span>{" "}
            Platform
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            MedhaGuard seamlessly locks student terminals while generating
            real-time suspicion graphs for system supervisors. Log in directly
            using your institution credentials.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
            <div className="bg-base-200/60 border border-base-300 p-3 rounded-xl text-center">
              <div className="text-xl font-extrabold text-primary">
                &lt;45ms
              </div>
              <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
                WS Latency
              </div>
            </div>
            <div className="bg-base-200/60 border border-base-300 p-3 rounded-xl text-center">
              <div className="text-xl font-extrabold text-secondary">
                YOLOv8
              </div>
              <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
                Vision Model
              </div>
            </div>
            <div className="bg-base-200/60 border border-base-300 p-3 rounded-xl text-center">
              <div className="text-xl font-extrabold text-accent">100%</div>
              <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
                Log Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid: Beautiful Eye-Catching Multi-Role Login Form */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="card w-full max-w-md bg-gradient-to-b from-base-200/80 to-base-200 border border-base-300 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
            {/* Split Role Toggles */}
            <div className="flex bg-base-300/40 p-2 border-b border-base-300">
              <button
                onClick={() => setActiveTab("student")}
                className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "student" ? "bg-primary text-primary-content shadow-lg" : "hover:bg-base-300"}`}
              >
                <GraduationCap className="w-4 h-4" /> Student Entry
              </button>
              <button
                onClick={() => setActiveTab("teacher")}
                className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === "teacher" ? "bg-secondary text-secondary-content shadow-lg" : "hover:bg-base-300"}`}
              >
                <Users className="w-4 h-4" /> Instructor Console
              </button>
            </div>

            {/* Form Section */}
            <div className="card-body p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{
                    opacity: 0,
                    x: activeTab === "student" ? -15 : 15,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "student" ? 15 : -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-base-content">
                      {activeTab === "student"
                        ? "Verify Student Space"
                        : "Access Control Room"}
                    </h2>
                    <p className="text-xs text-base-content/50 mt-1">
                      {activeTab === "student"
                        ? "Ensure your webcam is clear before entering exam code."
                        : "Authorized personnel authentication protocol only."}
                    </p>
                  </div>

                  {/* Input Fields */}
                  <div className="form-control w-full mt-4">
                    <label className="label py-1">
                      <span className="label-text font-bold text-xs opacity-70">
                        Institutional Email
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <input
                        type="email"
                        placeholder="username@university.edu"
                        className="input input-bordered w-full pl-10 rounded-xl text-sm bg-base-100 border-base-300 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text font-bold text-xs opacity-70">
                        Security Password
                      </span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input input-bordered w-full pl-10 rounded-xl text-sm bg-base-100 border-base-300 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {activeTab === "student" && (
                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text font-bold text-xs opacity-70">
                          Active Exam Token
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="EXAM-MERN-2026"
                        className="input input-bordered w-full rounded-xl text-sm bg-base-100 border-base-300 uppercase tracking-widest font-mono text-center font-bold focus:outline-none focus:border-primary"
                      />
                    </div>
                  )}

                  {/* Submit Trigger */}
                  <div className="pt-4">
                    <button
                      className={`btn w-full rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 ${activeTab === "student" ? "btn-primary shadow-primary/20" : "btn-secondary shadow-secondary/20"}`}
                    >
                      <LogIn className="w-4 h-4" /> Auth & Sync Session{" "}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. CORE PROCTORING FEATURES ================= */}
      <div
        id="features"
        className="py-24 bg-base-200/40 border-y border-base-200/60 relative"
      >
        <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Anti-Cheat Matrix
            </h2>
            <p className="text-sm md:text-base text-base-content/60">
              MedhaGuard coordinates multiple background parameters to assure
              absolute systemic validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature card 1 */}
            <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl shadow-inner group hover:border-primary/40 transition-all duration-300">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mt-4">
                AI Gaze Intercept
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed mt-1.5">
                Monitors gaze vectors to identify persistent multi-angle
                lookaways outside the active monitor interface.
              </p>
            </div>

            {/* Feature card 2 */}
            <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl shadow-inner group hover:border-secondary/40 transition-all duration-300">
              <div className="p-3 bg-secondary/10 text-secondary w-fit rounded-xl group-hover:bg-secondary group-hover:text-secondary-content transition-colors duration-300">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mt-4">
                Device Classifier
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed mt-1.5">
                Client-side browser computer vision execution filters physical
                materials, mobile devices or tablets instantly.
              </p>
            </div>

            {/* Feature card 3 */}
            <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl shadow-inner group hover:border-accent/40 transition-all duration-300">
              <div className="p-3 bg-accent/10 text-accent w-fit rounded-xl group-hover:bg-accent group-hover:text-accent-content transition-colors duration-300">
                <Ban className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mt-4">
                Hardware Lockout
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed mt-1.5">
                Restricts window resizing, multiple application context
                switches, copy-paste shortcuts and active clipboards.
              </p>
            </div>

            {/* Feature card 4 */}
            <div className="card bg-base-100 border border-base-300 p-6 rounded-2xl shadow-inner group hover:border-success/40 transition-all duration-300">
              <div className="p-3 bg-success/10 text-success w-fit rounded-xl group-hover:bg-success group-hover:text-success-content transition-colors duration-300">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-lg tracking-tight mt-4">
                WebSocket Pipe
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed mt-1.5">
                Pipes threat metadata via structural socket.io handlers directly
                to live instructor layout channels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. ABOUT & SYSTEM ARCHITECTURE SECTION ================= */}
      <div
        id="about"
        className="py-24 container mx-auto px-4 lg:px-12 max-w-7xl relative z-10"
      >
        <div className="card bg-neutral text-neutral-content shadow-2xl rounded-3xl overflow-hidden border border-neutral-focus">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Tech details */}
            <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-center space-y-5">
              <div className="badge badge-accent font-mono text-xs tracking-wider font-bold gap-1.5 py-2 px-3 uppercase rounded-md bg-accent/15 border-accent/20">
                <Info className="w-3.5 h-3.5" /> Inside MedhaGuard Core
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                How Our MERN Stack Mesh Works
              </h2>
              <p className="text-neutral-content/70 text-sm leading-relaxed">
                MedhaGuard is not just an overlay UI—it is an optimized
                environment engine. We isolate tasks safely on standard browsers
                without heavy background executable application downloads.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-neutral-focus rounded-lg text-accent mt-0.5">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Client-side WebRTC Mesh
                    </h4>
                    <p className="text-xs text-neutral-content/50">
                      Captures smooth, high-fidelity media pipelines directly
                      inside React contexts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="p-1.5 bg-neutral-focus rounded-lg text-accent mt-0.5">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      Node.js Threat Aggregator
                    </h4>
                    <p className="text-xs text-neutral-content/50">
                      Filters logs using structured Express pipelines before
                      writing violations into MongoDB datasets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Architecture Grid Mockup */}
            <div className="lg:col-span-7 bg-base-300/30 p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-neutral-focus flex items-center justify-center">
              <div className="w-full bg-neutral/40 border border-neutral-focus rounded-2xl p-6 font-mono text-xs text-neutral-content/90 space-y-4">
                <div className="text-accent">// PLATFORM PIPELINE MAPPING</div>

                {/* Step 1 */}
                <div className="p-3 bg-neutral-focus/60 rounded-xl border border-neutral-focus flex justify-between items-center">
                  <span>1. Student React UI</span>
                  <span className="badge badge-sm badge-primary border-0 font-bold font-mono">
                    Webcam Capture
                  </span>
                </div>
                {/* Arrow */}
                <div className="text-center opacity-30 text-white">
                  ↓ Real-time Client-Side Inference
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-neutral-focus/60 rounded-xl border border-neutral-focus flex justify-between items-center">
                  <span>2. Local TensorFlow Models</span>
                  <span className="badge badge-sm badge-secondary border-0 font-bold font-mono">
                    Gaze Matrix Logged
                  </span>
                </div>
                {/* Arrow */}
                <div className="text-center opacity-30 text-white">
                  ↓ Secured Socket.io Frame Pipes
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-neutral-focus/60 rounded-xl border border-neutral-focus flex justify-between items-center">
                  <span>3. Express Backend & MongoDB</span>
                  <span className="badge badge-sm badge-accent border-0 font-bold font-mono">
                    Teacher Screen Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5. SYSTEM STATUS FOOTER ================= */}
      <footer className="footer footer-center p-8 bg-base-200 text-base-content border-t border-base-300 font-mono text-xs opacity-70">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-4">
          <div>
            © 2026 MedhaGuard Architecture Ecosystem. All Rights Reserved.
          </div>
          <div className="flex gap-4">
            <span className="badge badge-sm badge-outline">React JS</span>
            <span className="badge badge-sm badge-outline">
              Tailwind/DaisyUI
            </span>
            <span className="badge badge-sm badge-primary badge-outline">
              Proctor Portal Core
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
