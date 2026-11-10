import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Award, Medal, Trophy } from "lucide-react";
import { Link, useParams } from "react-router";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const rankStyles = [
  "border-amber-300 bg-amber-50 text-amber-800",
  "border-slate-300 bg-slate-50 text-slate-700",
  "border-orange-300 bg-orange-50 text-orange-800",
];

function StudentAvatar({ result, size = "h-12 w-12" }) {
  const initials = (result.studentName || result.studentEmail || "?")
    .split(/[\s@]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-black text-slate-600`}
    >
      {result.photoURL ? (
        <img
          src={result.photoURL}
          alt={`${result.studentName || "Student"} profile`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling.style.display = "grid";
          }}
        />
      ) : null}
      <span style={{ display: result.photoURL ? "none" : "grid" }}>
        {initials}
      </span>
    </div>
  );
}

const TeacherExamResults = () => {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () =>
      (await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`)).data,
  });
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["exam-results", roomId],
    enabled: !!user?.email && !!roomId,
    queryFn: async () =>
      (await axiosSecure.get(`/rooms/${encodeURIComponent(roomId)}/results`))
        .data,
    refetchInterval: 5000,
  });

  const results = data?.results || [];
  const room = data?.room;
  const profileName = profile?.name || user?.displayName || "Teacher";
  const topThree = results.slice(0, 3);

  return (
    <DashboardShell
      role="teacher"
      profile={{
        name: profileName,
        email: profile?.email || user?.email || "-",
        joined: "",
      }}
      eyebrow="Exam results"
      title={room?.title || "Scoreboard"}
      description={
        room
          ? `${room.subject} · ${results.length} student${results.length === 1 ? "" : "s"} submitted`
          : "View marks and the top performers for this exam."
      }
      primaryAction={{
        to: `/exam/${roomId}/teacher`,
        label: "Open exam room",
      }}
      secondaryAction={{
        to: "/teacher/exams/create",
        label: "All exams",
      }}
      stats={[
        {
          icon: Trophy,
          label: "Submissions",
          value: String(results.length),
          change: "Students",
          tone: "secondary",
        },
        {
          icon: Award,
          label: "Top mark",
          value: topThree[0]
            ? `${topThree[0].score}/${topThree[0].total}`
            : "—",
          change: topThree[0]?.studentName || "No results yet",
          tone: "success",
        },
        {
          icon: Medal,
          label: "Exam status",
          value: room?.status || "—",
          change: "Room status",
          tone: "primary",
        },
      ]}
    >
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading exam results...
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-6 text-sm font-semibold text-red-700">
          {error.response?.data?.error || "Exam results could not be loaded."}
        </div>
      ) : (
        <div className="space-y-6">
          <Link
            to="/teacher/exams/create"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to exams
          </Link>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Top performers
                </h2>
                <p className="text-xs text-slate-500">
                  Highest marks for this exam
                </p>
              </div>
            </div>
            {topThree.length ? (
              <div className="grid gap-3 md:grid-cols-3">
                {topThree.map((result, index) => (
                  <article
                    key={result.studentEmail}
                    className={`flex items-center gap-3 rounded-xl border p-4 ${rankStyles[index]}`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/80 text-sm font-black">
                      {index + 1}
                    </span>
                    <StudentAvatar result={result} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black">
                        {result.studentName}
                      </p>
                      <p className="truncate text-xs opacity-70">
                        {result.studentEmail}
                      </p>
                      <p className="mt-1 text-sm font-extrabold">
                        {result.score} / {result.total} marks
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                No students have submitted this exam yet.
              </p>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-black text-slate-900">
                Student scoreboard
              </h2>
            </div>
            {results.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Rank</th>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Marks</th>
                      <th className="px-5 py-3">Percentage</th>
                      <th className="px-5 py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.map((result, index) => (
                      <tr key={result.studentEmail}>
                        <td className="px-5 py-3 font-black text-slate-600">
                          #{index + 1}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <StudentAvatar result={result} size="h-9 w-9" />
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-800">
                                {result.studentName}
                              </p>
                              <p className="truncate text-xs text-slate-500">
                                {result.studentEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-bold">
                          {result.score} / {result.total}
                        </td>
                        <td className="px-5 py-3">
                          {result.total
                            ? `${Math.round((result.score / result.total) * 100)}%`
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">
                          {new Date(result.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-slate-500">
                Results will appear here after students submit the exam.
              </p>
            )}
          </section>
        </div>
      )}
    </DashboardShell>
  );
};

export default TeacherExamResults;
