import { Eye, LockKeyhole, Radio, ScanFace, Zap } from "lucide-react";

const features = [
  {
    icon: ScanFace,
    title: "Face presence",
    text: "Confirm the right person stays in frame throughout the attempt.",
    tone: "blue",
  },
  {
    icon: Eye,
    title: "Attention signals",
    text: "Surface repeated gaze and window changes without noisy guesswork.",
    tone: "cyan",
  },
  {
    icon: LockKeyhole,
    title: "Browser guard",
    text: "Fullscreen, copy, paste, and tab events are captured in context.",
    tone: "violet",
  },
  {
    icon: Radio,
    title: "Live teacher view",
    text: "Stream compact integrity signals to the people supervising the room.",
    tone: "emerald",
  },
];

const Feature = () => (
  <section
    id="features"
    className="section-space border-y border-slate-200/80 bg-white/60"
  >
    <div className="site-container">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">
            <Zap className="h-4 w-4" /> Built for focus
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Quiet protection. Clear signals.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          The platform works in the background so teachers can see what matters
          and students can concentrate on the questions.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text, tone }) => (
          <article
            key={title}
            className="surface group p-5 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl ${tone === "blue" ? "bg-blue-100 text-blue-600" : tone === "cyan" ? "bg-cyan-100 text-cyan-600" : tone === "violet" ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-base font-black text-slate-950">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Feature;
