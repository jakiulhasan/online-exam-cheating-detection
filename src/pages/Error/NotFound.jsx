import React from "react";
import { Link, useNavigate } from "react-router";
import {
  Home,
  ArrowLeft,
  Search,
  HelpCircle,
  FileQuestion,
  Compass,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-300 text-base-content flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center relative z-10 py-12 px-6">
        {/* Floating Icon Badge */}
        <div className="inline-flex items-center justify-center p-4 bg-base-100/80 border border-base-200/50 rounded-3xl shadow-xl backdrop-blur-md mb-8 animate-bounce">
          <FileQuestion className="w-10 h-10 text-primary" />
        </div>

        {/* Big 404 Header */}
        <div className="relative mb-6">
          <h1 className="text-8xl sm:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-secondary opacity-90 drop-shadow-sm">
            404
          </h1>
          <span className="absolute -top-2 right-1/4 sm:right-1/3 badge badge-primary badge-outline text-xs font-semibold px-3 py-2 rounded-full uppercase tracking-wider">
            Page Lost
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Looks like you've wandered off track
        </h2>
        <p className="text-base-content/70 text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-md w-full sm:w-auto rounded-xl gap-2 font-medium border-base-content/20 hover:bg-base-100"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <Link
            to="/"
            className="btn btn-primary btn-md w-full sm:w-auto rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 text-white"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Quick Links Card */}
        <div className="bg-base-100/60 border border-base-200/80 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-4 flex items-center justify-center gap-1.5">
            <Compass className="w-4 h-4 text-primary" /> Quick Navigation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <Link
              to="/ai-features"
              className="p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors flex items-center gap-3 group"
            >
              <Search className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold">AI Features</div>
                <div className="text-[11px] text-base-content/60">
                  Explore platform capabilities
                </div>
              </div>
            </Link>

            <Link
              to="/system-spec"
              className="p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors flex items-center gap-3 group"
            >
              <HelpCircle className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-bold">System Specs</div>
                <div className="text-[11px] text-base-content/60">
                  View technical details
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
