import React from "react";
import { ShieldAlert } from "lucide-react";
import { Link, NavLink } from "react-router";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100/70 backdrop-blur-md border-b border-base-200/60 px-4 lg:px-12 sticky top-0 z-50">
      <div className="navbar-start">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-black text-xl md:text-2xl tracking-tighter"
        >
          <div className="p-2 bg-gradient-to-br from-primary to-secondary text-primary-content rounded-xl shadow-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">
            MedhaGuard
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        {/* gap-6 বাড়িয়ে লিঙ্কগুলোর মাঝে স্পেস বৃদ্ধি করা হয়েছে */}
        <ul className="flex items-center gap-6 font-bold text-sm">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-base-content/70 hover:text-primary hover:bg-base-200/50"
                }`
              }
            >
              Gateway Portal
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ai-features"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-base-content/70 hover:text-primary hover:bg-base-200/50"
                }`
              }
            >
              AI Features
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/system-spec"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-base-content/70 hover:text-primary hover:bg-base-200/50"
                }`
              }
            >
              System Spec
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <Link
          to="/auth"
          className="btn btn-secondary w-32 rounded-xl shadow-md"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
