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

const Navbar = () => {
  return (
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
  );
};
export default Navbar;
