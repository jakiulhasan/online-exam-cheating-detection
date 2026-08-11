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
const Feature = () => {
  return (
    <div>
      {" "}
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
    </div>
  );
};

export default Feature;
