import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Fingerprint,
  Mail,
  KeyRound,
  LogIn,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import axiosInstance from "../../Context/Axios/Axios";

// Google "G" logo (inline so we don't add a dependency)
const GoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" width="18" height="18" {...props}>
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.2-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 15.9 2 8.8 6.6 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 46c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5c-2 1.5-4.7 2.5-7.6 2.5-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C8.7 41.3 15.8 46 24 46z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5C41.4 36.3 46 30.7 46 24c0-1.2-.1-2.3-.4-3.5z"
    />
  </svg>
);

const Login = () => {
  const { userSignIn, googleSignIn, setRememberMe } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [email, setEmail] = useState(
    () => localStorage.getItem("medha_saved_email") || "",
  );
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() =>
    Boolean(localStorage.getItem("medha_saved_email")),
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Profile completion always takes priority over the requested destination.
  const resolveRoleAndGo = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken();
      const profileResponse = await axiosInstance.get(
        `/users/${encodeURIComponent(currentUser.email)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (profileResponse.data?.profileComplete !== true) {
        navigate("/profile/complete", { replace: true });
        return;
      }

      const roleResponse = await axiosInstance.get(
        `/users/${encodeURIComponent(currentUser.email)}/role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const role = roleResponse.data?.role || "student";
      const target =
        from || (role === "teacher" ? "/profile/teacher" : "/profile/student");
      navigate(target, { replace: true });
    } catch (requestError) {
      if (requestError?.response?.status === 404) {
        navigate("/profile/complete", { replace: true });
        return;
      }
      throw requestError;
    }
  };

  const rememberEmail = () => {
    if (remember) localStorage.setItem("medha_saved_email", email);
    else localStorage.removeItem("medha_saved_email");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await setRememberMe(remember); // Firebase session persistence
      const cred = await userSignIn(email, password);
      rememberEmail();
      await resolveRoleAndGo(cred.user);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await setRememberMe(remember);
      const cred = await googleSignIn();
      await resolveRoleAndGo(cred.user);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Decorative background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Logo (top-left) */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 font-black text-lg tracking-tighter z-20"
      >
        <div className="p-1.5 bg-gradient-to-br from-primary to-secondary text-primary-content rounded-lg shadow-lg">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <span className="bg-gradient-to-r from-primary via-indigo-500 to-secondary bg-clip-text text-transparent">
          MedhaGuard
        </span>
      </Link>

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Branding */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left hidden lg:block">
          <div className="badge badge-outline border-primary/30 text-primary gap-2 py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-full bg-primary/5">
            <Fingerprint className="w-3.5 h-3.5 animate-pulse" /> Secure
            Tokenized Auth
          </div>
          <h1 className="text-4xl xl:text-6xl font-black tracking-tight leading-[1.1]">
            Next-Gen <br />
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent">
              Exam Integrity
            </span>{" "}
            Platform
          </h1>
          <p className="text-base-content/70 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            MedhaGuard locks student terminals and generates real-time suspicion
            graphs for supervisors. Sign in with your institution credentials.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0">
            {[
              ["<45ms", "WS Latency", "text-primary"],
              ["YOLOv8", "Vision Model", "text-secondary"],
              ["100%", "Log Accuracy", "text-accent"],
            ].map(([v, l, c]) => (
              <div
                key={l}
                className="bg-base-100/60 border border-base-300 p-3 rounded-xl text-center"
              >
                <div className={`text-xl font-extrabold ${c}`}>{v}</div>
                <div className="text-[10px] opacity-60 font-medium uppercase mt-0.5">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login card */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="card w-full max-w-md bg-white/90 border border-slate-200 shadow-[0_24px_70px_rgba(20,33,61,0.1)] rounded-[26px] overflow-hidden backdrop-blur-md">
            <div className="card-body p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-base-content">
                  Welcome back
                </h2>
                <p className="text-xs text-base-content/60 mt-1">
                  Sign in to access your dashboard.
                </p>
              </div>

              {error && (
                <div className="alert alert-error text-sm py-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
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
                      className="input input-bordered w-full pl-10 rounded-xl text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

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
                      className="input input-bordered w-full pl-10 pr-10 rounded-xl text-sm focus:outline-none focus:border-primary"
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

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content/70">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="checkbox checkbox-xs checkbox-primary rounded"
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-white"
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" /> Sign In{" "}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="divider text-xs text-base-content/40 my-1">
                OR
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="btn btn-outline w-full rounded-xl font-semibold gap-2 border-base-300"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <p className="text-center text-sm text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Turn Firebase error codes into readable messages.
function friendlyError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password"))
    return "Incorrect email or password.";
  if (code.includes("user-not-found"))
    return "No account found with this email.";
  if (code.includes("too-many-requests"))
    return "Too many attempts. Please try again later.";
  if (code.includes("popup-closed")) return "Google sign-in was cancelled.";
  if (code.includes("network")) return "Network error. Check your connection.";
  return err?.message?.replace("Firebase:", "").trim() || "Login failed.";
}

export default Login;
