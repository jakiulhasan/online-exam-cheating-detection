import { useContext, useState } from "react";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useRole from "../../hooks/useRole";

const navItems = [
  { to: "/#features", label: "Capabilities" },
  { to: "/#about", label: "How it works" },
];

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const { role } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const profilePath =
    role === "teacher" ? "/profile/teacher" : "/profile/student";
  const initials = (user?.displayName || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  const handleLogout = async () => {
    await signOutUser();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-3 shadow-[0_12px_35px_rgba(20,33,61,0.08)] backdrop-blur-xl sm:px-5">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-cyan-300 shadow-lg shadow-slate-950/15">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-black tracking-tight text-slate-950">
            Medha<span className="text-blue-600">Guard</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            Home
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={profilePath}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-700"
              >
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600 text-xs text-white">
                  {initials}
                </span>{" "}
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Sign out"
                className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:text-blue-700"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 hover:bg-blue-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-[1180px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl md:hidden">
          <div className="grid gap-1">
            {[{ to: "/", label: "Home" }, ...navItems].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link
                to={profilePath}
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-3 text-sm font-bold text-blue-700"
              >
                <LayoutDashboard className="h-4 w-4" /> Open dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-slate-950 px-3 py-3 text-center text-sm font-bold text-white"
              >
                Create account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
