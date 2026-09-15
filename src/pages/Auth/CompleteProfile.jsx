import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  ShieldCheck,
  User,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY || "";

const CompleteProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || "");
  const [role, setRole] = useState("student");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
    );
    return response.data.data.url;
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      let photoURL = user?.photoURL || "";
      if (imageFile && IMGBB_API_KEY) photoURL = await uploadToImgBB(imageFile);

      await updateUserProfile({
        displayName: name.trim(),
        photoURL: photoURL || null,
      });
      const response = await axiosSecure.post("/users", {
        name: name.trim(),
        email: user.email,
        role,
        photoURL,
        profileComplete: true,
      });

      const savedProfile = response.data;
      queryClient.setQueryData(["user-profile", user.email], savedProfile);
      queryClient.setQueryData(["user-role", user.email], role);
      navigate(role === "teacher" ? "/profile/teacher" : "/profile/student", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.error ||
          "Could not save your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(20,33,61,0.1)] lg:grid-cols-[0.8fr_1.2fr]">
          <section className="hidden bg-slate-950 p-10 text-white lg:block">
            <Link to="/" className="flex items-center gap-2 text-lg font-black">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-cyan-200">
                <ShieldCheck className="h-5 w-5" />
              </span>
              MedhaGuard
            </Link>
            <div className="mt-24">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                One last step
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight">
                Make your workspace yours.
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-400">
                We need a few details before opening your exam workspace. This
                keeps room access and integrity records tied to the right
                profile.
              </p>
              <div className="mt-8 space-y-4 text-sm font-semibold text-slate-300">
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Choose
                  your workspace role
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Add your
                  display name
                </p>
                <p className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Save
                  everything securely
                </p>
              </div>
            </div>
          </section>
          <section className="p-6 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-black text-slate-950"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-cyan-300">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                MedhaGuard
              </Link>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Profile setup
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Complete your profile
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This information is required before you can enter the platform.
            </p>
            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                  <label
                    htmlFor="profile-photo"
                    className="absolute inset-0 grid cursor-pointer place-items-center bg-slate-950/60 text-white opacity-0 transition hover:opacity-100"
                  >
                    <ImagePlus className="h-5 w-5" />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="profile-photo"
                    className="cursor-pointer text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    Upload profile photo
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Optional. JPG or PNG.
                  </p>
                </div>
              </div>
              <label className="block">
                <span className="text-xs font-bold text-slate-600">
                  Full name
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-slate-600">
                  Email address
                </span>
                <input
                  value={user?.email || ""}
                  readOnly
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500 outline-none"
                />
              </label>
              <fieldset>
                <legend className="text-xs font-bold text-slate-600">
                  Choose your role
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {["student", "teacher"].map((option) => (
                    <label
                      key={option}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-bold capitalize transition ${role === option ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-blue-200"}`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option}
                        checked={role === option}
                        onChange={() => setRole(option)}
                        className="sr-only"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving profile..." : "Save and continue"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CompleteProfile;
