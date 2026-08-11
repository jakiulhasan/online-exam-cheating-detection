import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-8 bg-base-200 text-base-content border-t border-base-300 font-mono text-xs opacity-70">
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-4">
        <div>
          © 2026 MedhaGuard Architecture Ecosystem. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <span className="badge badge-sm badge-outline">React JS</span>
          <span className="badge badge-sm badge-outline">Tailwind/DaisyUI</span>
          <span className="badge badge-sm badge-primary badge-outline">
            Proctor Portal Core
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
