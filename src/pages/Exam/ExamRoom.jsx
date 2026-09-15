import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Clipboard,
  DoorOpen,
  Info,
  Plus,
  ShieldCheck,
  Users,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import DashboardShell from "../../components/dashboard/DashboardShell";

const ExamRoom = () => {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("MCQ");
  const [joinCode, setJoinCode] = useState("");
  const [notice, setNotice] = useState("");
  const isTeacher = role === "teacher";
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () =>
      (await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`)).data,
  });
  const {
    data: rooms = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rooms"],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get("/rooms")).data,
  });
  const createRoom = useMutation({
    mutationFn: (payload) => axiosSecure.post("/rooms", payload),
    onSuccess: () => {
      setTitle("");
      setNotice("Room created successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () =>
      setNotice("Could not create room. Check the backend connection."),
  });
  const joinRoom = useMutation({
    mutationFn: (code) => axiosSecure.post(`/rooms/${code}/join`),
    onSuccess: (_response, code) => {
      setJoinCode("");
      setNotice(`Joined room ${code}`);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: () =>
      setNotice("Could not join. Check the room code and try again."),
  });
  const copyCode = (code) =>
    navigator.clipboard
      ?.writeText(code)
      .then(() => setNotice(`Copied room code ${code}`));
  const name =
    profile?.name ||
    user?.displayName ||
    (isTeacher ? "Instructor" : "Student");
  const email = profile?.email || user?.email || "-";
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "-";
  const studentCount = rooms.reduce(
    (total, room) => total + (room.students?.length || 0),
    0,
  );

  return (
    <DashboardShell
      role={isTeacher ? "teacher" : "student"}
      profile={{ name, email, joined }}
      eyebrow={isTeacher ? "Teacher control room" : "Student exam lobby"}
      title={
        isTeacher ? "Manage your exam rooms." : "Find your next exam room."
      }
      description={
        isTeacher
          ? "Create a secure room, share its code, and keep your class ready from the same dashboard."
          : "Join the room shared by your instructor and launch a protected attempt when it is time."
      }
      primaryAction={{ to: "/exam/DEMO/take", label: "Try demo exam" }}
      secondaryAction={{
        to: isTeacher ? "/profile/teacher" : "/profile/student",
        label: "Back to overview",
      }}
      stats={
        isTeacher
          ? [
              {
                icon: ClipboardList,
                label: "Rooms created",
                value: String(rooms.length),
                change: "Workspace total",
                tone: "secondary",
              },
              {
                icon: Users,
                label: "Students reached",
                value: String(studentCount),
                change: "Across rooms",
                tone: "primary",
              },
              {
                icon: ShieldCheck,
                label: "Room security",
                value: "Active",
                change: "Protected",
                tone: "success",
              },
            ]
          : [
              {
                icon: ClipboardList,
                label: "Available rooms",
                value: String(rooms.length),
                change: "Live list",
                tone: "primary",
              },
              {
                icon: ShieldCheck,
                label: "Exam protection",
                value: "Ready",
                change: "Browser checks",
                tone: "success",
              },
              {
                icon: Users,
                label: "Your workspace",
                value: "1",
                change: "Account active",
                tone: "secondary",
              },
            ]
      }
    >
      <div className="space-y-6">
        {notice && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            <Info className="h-4 w-4" /> {notice}
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="surface p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${isTeacher ? "bg-indigo-100 text-indigo-600" : "bg-blue-100 text-blue-600"}`}
              >
                {isTeacher ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <DoorOpen className="h-5 w-5" />
                )}
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  {isTeacher ? "Create a room" : "Join a room"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isTeacher
                    ? "Set up a secure space and share the code with your class."
                    : "Enter the code shared by your instructor to see the exam."}
                </p>
              </div>
            </div>
            {isTeacher ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_150px_auto]">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Room name, e.g. CS101 Midterm"
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white"
                />
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-indigo-400"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="Written">Written</option>
                </select>
                <button
                  onClick={() =>
                    title.trim() && createRoom.mutate({ title, type })
                  }
                  disabled={createRoom.isPending || !title.trim()}
                  className="h-12 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createRoom.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  value={joinCode}
                  onChange={(event) =>
                    setJoinCode(event.target.value.toUpperCase())
                  }
                  placeholder="Enter room code"
                  className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm font-bold tracking-[0.2em] outline-none focus:border-blue-400 focus:bg-white"
                />
                <button
                  onClick={() => joinCode && joinRoom.mutate(joinCode)}
                  disabled={joinRoom.isPending || !joinCode}
                  className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {joinRoom.isPending ? "Joining..." : "Join room"}
                </button>
              </div>
            )}
          </section>
          <section className="rounded-[22px] bg-slate-950 p-5 text-white shadow-xl sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Simple by design
            </p>
            <h2 className="mt-3 text-xl font-black">
              From room code to protected attempt.
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="flex gap-3">
                <span className="text-sm font-black text-cyan-300">01</span>
                <p className="text-xs leading-5 text-slate-300">
                  {isTeacher
                    ? "Create a room and share its code."
                    : "Enter the code your instructor shared."}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-black text-cyan-300">02</span>
                <p className="text-xs leading-5 text-slate-300">
                  Open the room and start the proctored session.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-black text-cyan-300">03</span>
                <p className="text-xs leading-5 text-slate-300">
                  Integrity events are captured with room context.
                </p>
              </div>
            </div>
          </section>
        </div>
        <div>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">
                <Clipboard className="h-4 w-4" /> Workspace activity
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {isTeacher ? "Your created rooms" : "Available rooms"}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {rooms.length} total
            </span>
          </div>
          {isLoading && (
            <div className="mt-5 rounded-2xl bg-white p-8 text-center text-sm font-semibold text-slate-500">
              Loading rooms...
            </div>
          )}
          {isError && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
              Could not reach the backend. The demo exam is still available
              above.
            </div>
          )}
          {!isLoading && !isError && rooms.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Users className="mx-auto h-7 w-7 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-700">
                No rooms yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {isTeacher
                  ? "Create your first room above."
                  : "Join a room with the code above."}
              </p>
            </div>
          )}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <article key={room.code} className="surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{room.title}</h3>
                    <button
                      onClick={() => copyCode(room.code)}
                      className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {room.code}
                      <Clipboard className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    {room.type}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Users className="h-3.5 w-3.5" />{" "}
                    {room.students?.length || 0} students
                  </span>
                  <Link
                    to={`/exam/${room.code}/take`}
                    className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700"
                  >
                    Open room <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ExamRoom;
