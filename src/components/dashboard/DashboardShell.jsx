import React from "react";
import { Link, useLocation } from "react-router";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";

const DashboardShell = ({
  profile,
  role,
  stats,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}) => {
  const { signOutUser } = React.useContext(AuthContext);
  const { pathname } = useLocation();
  const isTeacher = role === "teacher";
  const isRoomPage = pathname === "/exam";
  const accentClasses = isTeacher
    ? { bg: "bg-secondary", soft: "bg-secondary/15" }
    : { bg: "bg-primary", soft: "bg-primary/15" };
  const initials = profile.name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOutUser();
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="hidden self-start rounded-[28px] bg-slate-950 p-5 text-white shadow-xl lg:sticky lg:top-5 lg:flex lg:h-[calc(100vh-40px)] lg:flex-col lg:overflow-hidden">
          <Link to="/" className="flex items-center gap-3 px-2 py-3">
            <span
              className={`grid h-10 w-10 place-items-center rounded-2xl ${accentClasses.bg} text-white shadow-lg`}
            >
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-lg font-black tracking-tight">
              MedhaGuard
            </span>
          </Link>

          <div className="mt-10">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Workspace
            </p>
            <nav className="mt-3 space-y-1">
              <Link
                to={isTeacher ? "/profile/teacher" : "/profile/student"}
                className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold transition ${!isRoomPage ? accentClasses.soft : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
              >
                <span className="flex items-center gap-3">
                  <Activity className="h-4 w-4" /> Overview
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                to="/exam"
                className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold transition ${isRoomPage ? accentClasses.soft + " text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}
              >
                <span>{isTeacher ? "Manage rooms" : "Exam rooms"}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 font-black text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{profile.name}</p>
                <p className="text-xs capitalize text-slate-400">
                  {role} account
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-2 rounded-xl px-1 text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link
              to="/"
              className="text-xl font-black tracking-tight text-slate-950"
            >
              MedhaGuard
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm gap-2"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>

          <div
            className={`relative overflow-hidden rounded-[30px] ${accentClasses.bg} p-6 text-white shadow-lg sm:p-8`}
          >
            <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-[28px] border-white/10" />
            <div className="relative max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                {eyebrow}
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
                {description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={primaryAction.to}
                  className="btn border-0 bg-white text-slate-900 shadow-none hover:bg-white/90"
                >
                  {primaryAction.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                {secondaryAction && (
                  <Link
                    to={secondaryAction.to}
                    className="btn btn-ghost border border-white/25 text-white hover:bg-white/10"
                  >
                    {secondaryAction.label}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const toneClasses = {
                primary: "bg-primary/10 text-primary",
                secondary: "bg-secondary/10 text-secondary",
                success: "bg-success/10 text-success",
                error: "bg-error/10 text-error",
              };
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl ${toneClasses[stat.tone]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">
                      {stat.change}
                    </span>
                  </div>
                  <p className="mt-5 text-2xl font-black text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
            <div>{children}</div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <h2 className="text-sm font-bold text-slate-950">
                  Account snapshot
                </h2>
              </div>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Email</p>
                  <p className="mt-1 truncate font-semibold text-slate-700">
                    {profile.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Member since
                  </p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {profile.joined}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-600">
                    Protected workspace
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your exam activity and integrity signals stay connected to
                    this account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardShell;
