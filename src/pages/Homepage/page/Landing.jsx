import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Fingerprint,
  LockKeyhole,
  ScanFace,
  ShieldCheck,
} from "lucide-react";
import Feature from "../Ai/Feature";
import Spec from "../spec/Spec";
import { AuthContext } from "../../../Context/AuthContext/AuthContext";
import useRole from "../../../hooks/useRole";

const Landing = () => {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const location = useLocation();
  const dashboardPath =
    role === "teacher" ? "/profile/teacher" : "/profile/student";

  useEffect(() => {
    if (location.hash) {
      const target = setTimeout(
        () =>
          document
            .getElementById(location.hash.slice(1))
            ?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
      return () => clearTimeout(target);
    }
    window.scrollTo({ top: 0 });
  }, [location.hash]);

  return (
    <div className="overflow-hidden text-slate-900">
      <section className="site-container grid min-h-[calc(100vh-92px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="max-w-2xl">
          <span className="eyebrow">
            <Fingerprint className="h-4 w-4" /> Browser-native exam integrity
          </span>
          <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-7xl">
            Exams that feel fair,{" "}
            <span className="text-blue-600">because they are.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
            MedhaGuard gives teachers a calm command center and students a
            focused exam room, with real-time signals that protect the integrity
            of every attempt.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {user ? (
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-slate-950/15 hover:bg-blue-700"
              >
                Open my workspace <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700"
                >
                  Start protecting exams <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No downloads
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Live
              violation logs
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Firebase
              secured
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -inset-6 rounded-[42px] bg-blue-200/30 blur-3xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-900/20">
            <div className="flex items-center justify-between border-b border-white/10 px-3 pb-3 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />{" "}
                Live proctoring room
              </span>
              <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
                SECURE
              </span>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-[1.25fr_0.75fr]">
              <div className="relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-blue-950 p-4">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-bold text-white">
                  <ScanFace className="h-4 w-4 text-cyan-300" /> Face present{" "}
                  <span className="ml-2 text-emerald-300">98%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Activity className="h-4 w-4 text-cyan-300" />
                  <p className="mt-4 text-2xl font-black text-white">00</p>
                  <p className="text-[11px] font-bold text-slate-400">
                    Flags detected
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <LockKeyhole className="h-4 w-4 text-emerald-300" />
                  <p className="mt-4 text-sm font-black text-white">
                    Fullscreen on
                  </p>
                  <p className="text-[11px] font-bold text-slate-400">
                    Browser locked
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 px-3 pb-3 text-center text-[10px] font-bold text-slate-400">
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <span className="block text-sm text-white">45ms</span>latency
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <span className="block text-sm text-white">99.9%</span>uptime
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <span className="block text-sm text-white">24/7</span>signals
              </div>
            </div>
          </div>
        </div>
      </section>
      <Feature />
      <Spec />
      <section className="site-container pb-16">
        <div className="relative overflow-hidden rounded-[28px] bg-blue-600 px-6 py-12 text-center text-white shadow-xl shadow-blue-600/15 sm:px-12">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-white/10" />
          <ShieldCheck className="mx-auto h-8 w-8 text-cyan-200" />
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Make your next exam count.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-blue-100">
            Create a room, invite your class, and keep every attempt accountable
            without adding friction.
          </p>
          <Link
            to={user ? dashboardPath : "/register"}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            {user ? "Open dashboard" : "Create free account"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
