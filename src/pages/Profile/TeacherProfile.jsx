import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  ClipboardList,
  MonitorPlay,
  PlusCircle,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router";
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
  const {
    data: rooms = [],
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useQuery({
    queryKey: ["rooms", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get("/rooms")).data,
  });
  const name = profile?.name || user?.displayName || "Instructor";
  const email = profile?.email || user?.email || "-";
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "-";
  const createdExams = rooms.filter(
    (room) => room.teacherEmail?.toLowerCase() === user?.email?.toLowerCase(),
  );
  const studentsReached = new Set(
    createdExams.flatMap((room) =>
      (room.students || []).map((student) => student.email?.toLowerCase()),
    ),
  ).size;
  const activeSessions = createdExams.filter(
    (room) => room.status === "in-progress",
  ).length;

  return (
    <DashboardShell
      role="teacher"
      profile={{ name, email, joined }}
      eyebrow="Teacher workspace"
      title={`Good to see you, ${name.split(" ")[0]}.`}
      description="Create an exam, set its schedule, and invite students by Gmail address."
      primaryAction={{ to: "/teacher/exams/create", label: "Create exam" }}
      stats={[
        {
          icon: ClipboardList,
          label: "Rooms created",
          value: String(createdExams.length),
          change: "All exams",
          tone: "secondary",
        },
        {
          icon: Users,
          label: "Students reached",
          value: String(studentsReached),
          change: "Across rooms",
          tone: "primary",
        },
        {
          icon: MonitorPlay,
          label: "Active sessions",
          value: String(activeSessions),
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
              Your exams and student participation will appear here.
            </p>
          </div>
          <div className="hidden rounded-xl bg-secondary/10 p-3 text-secondary sm:block">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/teacher/exams/create"
            className="rounded-xl border border-dashed border-slate-300 p-4 transition hover:border-secondary hover:bg-secondary/5"
          >
            <PlusCircle className="h-4 w-4 text-secondary" />
            <p className="mt-3 text-sm font-bold text-slate-800">Create exam</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Add exam details and choose which Gmail accounts can join.
            </p>
          </Link>
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
      <section className="mt-6 border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-secondary" />
            <h2 className="text-sm font-black text-slate-900">Your exams</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {createdExams.length}
          </span>
        </div>
        {isLoadingRooms ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            Loading your exams...
          </p>
        ) : isRoomsError ? (
          <p role="alert" className="px-5 py-6 text-sm font-semibold text-red-700">
            Your exams could not be loaded. Please try again.
          </p>
        ) : createdExams.length ? (
          <ul className="divide-y divide-slate-100">
            {createdExams.map((exam) => (
              <li
                key={exam.code}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {exam.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
                    <span>{exam.subject}</span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {new Date(exam.scheduledAt).toLocaleString()}
                    </span>
                    <span>{exam.students?.length || 0} students</span>
                  </div>
                </div>
                <Link
                  to={`/teacher/exams/${encodeURIComponent(exam.code)}/results`}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 bg-secondary px-4 text-xs font-bold text-white transition hover:brightness-95"
                >
                  <Trophy className="h-4 w-4" />
                  View results
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No exams created yet.
            </p>
            <Link
              to="/teacher/exams/create"
              className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-secondary"
            >
              <PlusCircle className="h-4 w-4" /> Create your first exam
            </Link>
          </div>
        )}
      </section>
    </DashboardShell>
  );
};

export default TeacherProfile;
