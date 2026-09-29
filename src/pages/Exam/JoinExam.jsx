import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, Clock3, Users } from "lucide-react";
import { Link, useNavigate } from "react-router";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const JoinExam = () => {
  const { user } = useContext(AuthContext);
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () =>
      (await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`)).data,
  });
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get("/rooms")).data,
  });
  const joinExam = useMutation({
    mutationFn: (code) =>
      axiosSecure.post(`/rooms/${code}/join`, {
        name: profile?.name || user?.displayName || "Student",
      }),
    onSuccess: ({ data }) => {
      setRoomCode("");
      queryClient.setQueryData(["rooms", user?.email], (current = []) =>
        current.map((room) =>
          room.code === data.code
            ? { ...room, students: data.room.students }
            : room,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      navigate(`/exam/${data.code}/live`);
    },
  });

  const email = user?.email?.toLowerCase();
  const assignedExams = rooms.filter((room) => room.isAssigned);
  const name = profile?.name || user?.displayName || "Student";
  const profileEmail = profile?.email || user?.email || "-";

  return (
    <DashboardShell
      role="student"
      profile={{ name, email: profileEmail, joined: "" }}
      eyebrow="Student workspace"
      title="Join exam"
      description="Join an assigned exam or enter a room code. You will wait in the live room until your teacher starts the exam."
      primaryAction={{ to: "/student/exams/join", label: "Join exam" }}
      secondaryAction={{ to: "/profile/student", label: "Overview" }}
      stats={[]}
    >
      <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-black text-slate-900">Assigned to you</h2>
          <p className="truncate text-xs font-medium text-slate-500">
            {profileEmail}
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (roomCode.trim()) joinExam.mutate(roomCode.trim().toUpperCase());
        }}
        className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row"
      >
        <label className="grid min-w-0 flex-1 gap-1.5 text-xs font-bold text-slate-700">
          Room code
          <input
            required
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
            placeholder="Enter the code from your teacher"
            className="h-10 rounded-lg border border-slate-200 px-3 font-mono text-sm outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          disabled={!roomCode.trim() || joinExam.isPending}
          className="mt-auto h-10 shrink-0 rounded-lg bg-primary px-5 text-xs font-bold text-white disabled:opacity-50"
        >
          {joinExam.isPending ? "Joining..." : "Join room"}
        </button>
      </form>

      {joinExam.isError && (
        <p role="alert" className="mb-4 text-sm font-semibold text-red-700">
          {joinExam.error.response?.data?.error || "Could not join this exam."}
        </p>
      )}

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {assignedExams.map((exam) => {
          const isJoined = exam.students?.some(
            (student) => student.email.toLowerCase() === email,
          );
          const isJoining =
            joinExam.isPending && joinExam.variables === exam.code;
          return (
            <article
              key={exam.code}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">
                    {exam.title}
                  </h3>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                    {exam.subject}
                  </span>
                </div>
                {exam.instructions && (
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {exam.instructions}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {new Date(exam.scheduledAt).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" /> {exam.durationMinutes}{" "}
                    minutes
                  </span>
                </div>
              </div>
              {isJoined ? (
                <Link
                  to={`/exam/${exam.code}/live`}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white"
                >
                  Enter live room <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => joinExam.mutate(exam.code)}
                  disabled={isJoining}
                  className="h-10 shrink-0 rounded-lg bg-primary px-4 text-xs font-bold text-white disabled:opacity-50"
                >
                  {isJoining ? "Joining..." : "Join exam"}
                </button>
              )}
            </article>
          );
        })}
        {!isLoading && assignedExams.length === 0 && (
          <div className="px-5 py-12 text-center">
            <h3 className="text-sm font-black text-slate-900">
              No assigned exams
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Enter a room code from your teacher, or ask them to invite{" "}
              {profileEmail}.
            </p>
          </div>
        )}
        {isLoading && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            Loading assigned exams...
          </p>
        )}
      </div>
    </DashboardShell>
  );
};

export default JoinExam;
