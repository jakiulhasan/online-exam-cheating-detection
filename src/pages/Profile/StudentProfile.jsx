import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  Clock3,
  History,
  ShieldCheck,
  Target,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DashboardShell from "../../components/dashboard/DashboardShell";

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data,
  });
  const name = profile?.name || user?.displayName || "Student";
  const email = profile?.email || user?.email || "-";
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "-";

  return (
    <DashboardShell
      role="student"
      profile={{ name, email, joined }}
      eyebrow="Student workspace"
      title={`Welcome back, ${name.split(" ")[0]}.`}
      description="See exams assigned to your Gmail account, check their schedule, and join when you are ready."
      primaryAction={{ to: "/student/exams/join", label: "Join exam" }}
      stats={[
        {
          icon: History,
          label: "Exams taken",
          value: "0",
          change: "This term",
          tone: "primary",
        },
        {
          icon: AlertTriangle,
          label: "Integrity flags",
          value: "0",
          change: "All clear",
          tone: "error",
        },
        {
          icon: ShieldCheck,
          label: "Integrity score",
          value: "100%",
          change: "Excellent",
          tone: "success",
        },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-black text-slate-950">
                Your next step
              </h2>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Exams assigned to {email} will appear in your join list. Your
              camera and browser activity are checked during a protected exam.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <Target className="h-4 w-4" /> Ready to focus
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <Clock3 className="h-4 w-4 text-slate-400" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Assigned exams
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Check the Join exam page for dates and duration.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Secure by default
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Integrity checks run only inside an active exam.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default StudentProfile;
