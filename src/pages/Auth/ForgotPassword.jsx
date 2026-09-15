import { useContext, useState } from "react";
import { Link } from "react-router";
import {
  Mail,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";

const ForgotPassword = () => {
  const { passwordReset } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await passwordReset(email);
      setSent(true);
    } catch (err) {
      const code = err?.code || "";
      if (code.includes("user-not-found"))
        setError("No account found with this email.");
      else if (code.includes("invalid-email"))
        setError("Please enter a valid email.");
      else setError("Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

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

      <div className="card w-full max-w-md bg-white/90 shadow-[0_24px_70px_rgba(20,33,61,0.1)] border border-slate-200 rounded-[26px] p-6 sm:p-8 relative z-10 backdrop-blur-md">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="inline-flex p-3 bg-success/10 text-success rounded-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold">Check your inbox</h2>
            <p className="text-sm text-base-content/60">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-base-content">{email}</span>.
            </p>
            <Link to="/login" className="btn btn-primary w-full rounded-xl">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold">Reset your password</h2>
              <p className="text-sm text-base-content/60 mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {error && (
              <div className="alert alert-error text-sm py-2 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div className="form-control">
                <label className="label text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="input input-bordered w-full pl-10 focus:input-primary rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-xl text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 mt-6 text-sm text-primary font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
