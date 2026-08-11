import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import axiosInstance from "../../Context/Axios/Axios";
import axios from "axios";
import { Eye, EyeOff, Upload, User, Mail, Lock } from "lucide-react";

const Register = () => {
  const { createAccount, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  // State Management
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Photo Upload States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ImgBB API Key
  const IMGBB_API_KEY = "05f1a028b1b4b170db41ebd11df77db8";

  // Password Strength Calculator
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

  // Handle Local Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload Image to ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
    );
    return response.data.data.url;
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    // Password Validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      let photoURL = "";

      // 1. Upload photo if selected
      if (imageFile) {
        setUploadingImage(true);
        photoURL = await uploadToImgBB(imageFile);
        setUploadingImage(false);
      }

      // 2. Create Firebase Account
      await createAccount(email, password);

      // 3. Update User Profile with Name & Photo
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL || null,
      });

      // 4. Save User Info to Backend Database
      await axiosInstance.post("/users", {
        name,
        email,
        role,
        photoURL,
      });

      // 5. Save credentials if Remember Me is checked (Login Form auto-fill এর জন্য)
      if (rememberMe) {
        localStorage.setItem("medha_saved_email", email);
        localStorage.setItem("medha_saved_password", password);
      } else {
        localStorage.removeItem("medha_saved_email");
        localStorage.removeItem("medha_saved_password");
      }

      // 6. Navigate based on Role
      navigate(role === "teacher" ? "/profile/teacher" : "/profile/student");
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl border border-base-300 rounded-3xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-base-content">
            Create an Account
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Join us today! Please fill in your details.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Profile Photo Upload Section */}
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
              {imageFile ? imageFile.name : "Choose profile picture"}
            </span>
          </div>

          {/* Full Name Field */}
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

          {/* Email Field */}
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

          {/* Password Field */}
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

            {/* Password Strength Indicator */}
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
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="form-control">
            <label className="label text-sm font-medium">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                  role === "student"
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-base-300 hover:border-base-400"
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
                    : "border-base-300 hover:border-base-400"
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-base-content/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox checkbox-sm checkbox-primary rounded"
              />
              Remember me (Save credentials for login)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full rounded-xl mt-4 text-white font-medium"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : uploadingImage ? (
              "Uploading Image..."
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-base-content/60">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
