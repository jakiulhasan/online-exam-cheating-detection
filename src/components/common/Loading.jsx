import React from "react";
import { ShieldAlert } from "lucide-react";

const Loading = ({ label = "Loading..." }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-200">
    <div className="p-3 bg-gradient-to-br from-primary to-secondary text-primary-content rounded-2xl shadow-lg animate-pulse">
      <ShieldAlert className="w-6 h-6" />
    </div>
    <span className="loading loading-spinner loading-lg text-primary" />
    <p className="text-sm text-base-content/60 font-medium">{label}</p>
  </div>
);

export default Loading;
