import React, { useState, useEffect } from "react";
import {
  Fingerprint,
  Mail,
  KeyRound,
  LogIn,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

const GatewayLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 1. ওয়েবসাইটে অথবা লগইন পেজে আসলে পূর্বে সেভ করা Email ও Password অটো-লোড হবে
  useEffect(() => {
    const savedEmail = localStorage.getItem("medha_saved_email");
    const savedPassword = localStorage.getItem("medha_saved_password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // 2. লগইন হ্যান্ডলার
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remember Me লজিক
      if (rememberMe) {
        localStorage.setItem("medha_saved_email", email);
        localStorage.setItem("medha_saved_password", password);
      } else {
        localStorage.removeItem("medha_saved_email");
        localStorage.removeItem("medha_saved_password");
      }

      // TODO: আপনার Auth Context বা Firebase Login কল করুন
      // await userSignIn(email, password);

      console.log("Logged in with:", { email, password, rememberMe });
      // navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="gateway"
      className="container mx-auto px-4 lg:px-12 py-12 lg:py-20 max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
    >
      {/* Left Grid: Branding and System Stats */}
      <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
        <div className="badge badge-outline border-primary/30 text-primary gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-full bg-primary/5">
          <Fingerprint className="w-3.5 h-3.5 animate-pulse" /> Secure Tokenized
          Auth
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]">
          Next-Gen <br />
          <span className="bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent">
            Exam Integrity
          </span>{" "}
          Platform
        </h1>
        <p className="text-base-content/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
          MedhaGuard seamlessly locks student terminals while generating
          real-time suspicion graphs for system supervisors. Log in directly
          using your institution credentials.
        </p>

        <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
          <div className="bg-base-200/60 border border-base-300 p-3 rounded-xl text-center">
            <div className="text-xl font-extrabold text-primary">&lt;45ms</div>
            <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
              WS Latency
            </div>
          </div>
          <div className="bg-base-200/60 border border-base-300 p-3 rounded-xl text-center">
            <div className="text-xl font-extrabold text-secondary">YOLOv8</div>
            <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
              Vision Model
            </div>
          </div>
          <div className="bg-base-200/60 border border-base-300 p-3 rounded-xl text-center">
            <div className="text-xl font-extrabold text-accent">100%</div>
            <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
              Log Accuracy
            </div>
          </div>
        </div>
      </div>

      {/* Right Grid: Single Streamlined Login Card */}
      <div className="lg:col-span-6 flex justify-center">
        <div className="card w-full max-w-md bg-base-100/80 border border-base-300 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="card-body p-8 space-y-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-base-content">
                System Authentication
              </h2>
              <p className="text-xs text-base-content/60 mt-1">
                Enter your account details to proceed.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs opacity-70">
                    Email
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@university.edu"
                    className="input input-bordered w-full pl-10 rounded-xl text-sm bg-base-100 border-base-300 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text font-bold text-xs opacity-70">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm bg-base-100 border-base-300 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox checkbox-xs checkbox-primary rounded"
                  />
                  Remember Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" /> Sign In & Sync Session{" "}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatewayLogin;
