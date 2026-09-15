import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  ClipboardList,
  MonitorPlay,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import DashboardShell from "../../components/dashboard/DashboardShell";

const TeacherProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/users/${user.email}`)).data,
  });
  const name = profile?.name || user?.displayName || "Instructor";
  const email = profile?.email || user?.email || "-";
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "-";

  return (
    <DashboardShell
      role="teacher"
      profile={{ name, email, joined }}
      eyebrow="Teacher workspace"
      title={`Good to see you, ${name.split(" ")[0]}.`}
      description="Create secure exam rooms, keep an eye on participation, and review integrity signals from one command center."
      primaryAction={{ to: "/exam", label: "Create exam room" }}
      secondaryAction={{ to: "/exam", label: "Open live monitor" }}
      stats={[
        {
          icon: ClipboardList,
          label: "Rooms created",
          value: "0",
          change: "Ready to start",
          tone: "secondary",
        },
        {
          icon: Users,
          label: "Students reached",
          value: "0",
          change: "Across rooms",
          tone: "primary",
        },
        {
          icon: MonitorPlay,
          label: "Active sessions",
          value: "0",
          change: "Live now",
          tone: "success",
        },
      ]}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Teaching control center
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your rooms and monitoring activity will appear here.
            </p>
          </div>
          <div className="hidden rounded-xl bg-secondary/10 p-3 text-secondary sm:block">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-slate-300 p-4">
            <PlusCircle className="h-4 w-4 text-secondary" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Create your first room
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Set an exam type, share the generated code, and invite your
              students.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-slate-300 p-4">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <p className="mt-3 text-sm font-bold text-slate-800">
              Integrity overview
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Violation signals are grouped by room for quick review.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default TeacherProfile;
