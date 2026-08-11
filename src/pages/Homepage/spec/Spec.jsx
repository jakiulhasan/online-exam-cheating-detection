import React from "react";
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
const Spec = () => {
  return (
    <div>
      {" "}
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
    </div>
  );
};

export default Spec;
