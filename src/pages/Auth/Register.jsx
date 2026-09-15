import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import axiosInstance from "../../Context/Axios/Axios";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Upload,
  User,
  Mail,
  Lock,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY || "";

const Register = () => {
  const { createAccount, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: "", color: "" };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, text: "Weak", color: "bg-error" };
      case 2:
        return { score: 50, text: "Fair", color: "bg-warning" };
      case 3:
        return { score: 75, text: "Good", color: "bg-info" };
      case 4:
        return { score: 100, text: "Strong", color: "bg-success" };
      default:
        return { score: 0, text: "", color: "" };
    }
  };

  const strength = getPasswordStrength(password);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
    );
    return response.data.data.url;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      let photoURL = "";

      // 1. Upload photo if selected (skip gracefully if no imgbb key)
      if (imageFile && IMGBB_API_KEY) {
        setUploadingImage(true);
        photoURL = await uploadToImgBB(imageFile);
        setUploadingImage(false);
      }

      // 2. Create Firebase account
      const cred = await createAccount(email, password);

      // 3. Update Firebase profile
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL || null,
      });

      // 4. Save the completed profile to the backend.
      const token = await cred.user.getIdToken();
      await axiosInstance.post(
        "/users",
        { name, email, role, photoURL, profileComplete: true },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 5. Redirect by role (NOTE: password is never stored anywhere)
      navigate(role === "teacher" ? "/profile/teacher" : "/profile/student", {
        replace: true,
      });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

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

      <div className="card w-full max-w-lg bg-white/90 shadow-[0_24px_70px_rgba(20,33,61,0.1)] border border-slate-200 rounded-[26px] p-6 sm:p-8 relative z-10 backdrop-blur-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-base-content">
            Create an Account
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Join MedhaGuard today! Please fill in your details.
          </p>
        </div>

        {error && (
          <div className="alert alert-error text-sm py-2 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 flex items-center justify-center bg-base-200 group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-base-content/40" />
              )}
              <label
                htmlFor="photo-upload"
                className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
              >
                <Upload className="w-5 h-5 mb-1" />
                Upload
              </label>
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-xs text-base-content/60">
              {imageFile ? imageFile.name : "Choose profile picture (optional)"}
            </span>
          </div>

          {/* Full Name */}
          <div className="form-control">
            <label className="label text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input input-bordered w-full pl-10 focus:input-primary rounded-xl"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label text-sm font-medium">Email Address</label>
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

          {/* Password */}
          <div className="form-control">
            <label className="label text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-10 focus:input-primary rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-base-content/60">Strength:</span>
                  <span className="font-semibold">{strength.text}</span>
                </div>
                <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="form-control">
            <label className="label text-sm font-medium">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  role === "student"
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-base-300 hover:border-base-content/30"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "student"}
                  onChange={() => setRole("student")}
                  className="hidden"
                />
                Student
              </label>

              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  role === "teacher"
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-base-300 hover:border-base-content/30"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "teacher"}
                  onChange={() => setRole("teacher")}
                  className="hidden"
                />
                Teacher
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-xl mt-2 text-white font-medium"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : uploadingImage ? (
              "Uploading Image..."
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-base-content/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

function friendlyError(err) {
  const code = err?.code || "";
  if (code.includes("email-already-in-use"))
    return "An account with this email already exists.";
  if (code.includes("invalid-email")) return "Please enter a valid email.";
  if (code.includes("weak-password"))
    return "Password is too weak (min 6 characters).";
  if (code.includes("network")) return "Network error. Check your connection.";
  return (
    err?.message?.replace("Firebase:", "").trim() || "Registration failed."
  );
}

export default Register;
