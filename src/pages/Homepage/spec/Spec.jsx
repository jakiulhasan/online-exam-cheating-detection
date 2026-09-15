import {
  ArrowDown,
  Database,
  Network,
  Server,
  ShieldCheck,
} from "lucide-react";

const Spec = () => (
  <section id="about" className="section-space">
    <div className="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div>
        <span className="eyebrow">
          <ShieldCheck className="h-4 w-4" /> Designed for trust
        </span>
        <h2 className="mt-3 max-w-md text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          One clean signal path from browser to teacher.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
          MedhaGuard combines client-side checks, authenticated APIs, and
          MongoDB records into a workflow that is easy to understand and easy to
          review.
        </p>
        <div className="mt-7 space-y-4">
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Signals stay contextual
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Every event is tied to a room, student, and timestamp.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-600">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Teachers see the useful layer
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                No raw noise, just actionable integrity information.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="surface overflow-hidden bg-slate-950 p-5 text-white sm:p-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              System map
            </p>
            <h3 className="mt-1 text-lg font-black">Integrity pipeline</h3>
          </div>
          <Database className="h-5 w-5 text-slate-500" />
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/20 text-blue-300">
              01
            </span>
            <div>
              <p className="text-sm font-bold">Student browser</p>
              <p className="text-xs text-slate-400">
                Camera, fullscreen, and activity checks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 text-slate-500">
            <ArrowDown className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              authenticated event stream
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/20 text-cyan-300">
              02
            </span>
            <div>
              <p className="text-sm font-bold">MedhaGuard API</p>
              <p className="text-xs text-slate-400">
                Role-aware room and violation routes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 text-slate-500">
            <ArrowDown className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              stored with room context
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
              03
            </span>
            <div>
              <p className="text-sm font-bold">Teacher workspace</p>
              <p className="text-xs text-slate-400">
                Review the story behind every flag
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Spec;
