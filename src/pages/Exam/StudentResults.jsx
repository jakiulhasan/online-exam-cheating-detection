import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Medal, Trophy } from "lucide-react";
import { Link } from "react-router";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const rankStyles = [
  "border-amber-300 bg-amber-50 text-amber-800",
  "border-slate-300 bg-slate-50 text-slate-700",
  "border-orange-300 bg-orange-50 text-orange-800",
];

function StudentAvatar({ student, size = "h-11 w-11" }) {
  const initials = (student.studentName || student.studentEmail || "?")
    .split(/[\s@]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`grid ${size} shrink-0 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-black text-slate-600`}
    >
      {student.photoURL ? (
        <img
          src={student.photoURL}
          alt={`${student.studentName || "Student"} profile`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling.style.display = "grid";
          }}
        />
      ) : null}
      <span style={{ display: student.photoURL ? "none" : "grid" }}>
        {initials}
      </span>
    </div>
  );
}

const StudentResults = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () =>
      (await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`)).data,
  });
  const {
    data: results = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-results", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get("/results/me")).data,
  });

  const name = profile?.name || user?.displayName || "Student";
  const average = results.length
    ? Math.round(
        (results.reduce(
          (sum, result) =>
            sum + (result.total ? result.score / result.total : 0),
          0,
        ) /
          results.length) *
          100,
      )
    : 0;

  return (
    <DashboardShell
      role="student"
      profile={{
        name,
        email: profile?.email || user?.email || "-",
        joined: "",
      }}
      eyebrow="My results"
      title="Your exam scoreboard"
      description="Review your marks for each exam and see the top performers in every room."
      primaryAction={{
        to: "/student/exams/join",
        label: "Join an exam",
      }}
      stats={[
        {
          icon: Medal,
          label: "Exams completed",
          value: String(results.length),
          change: "Submitted",
          tone: "primary",
        },
        {
          icon: Award,
          label: "Average score",
          value: results.length ? `${average}%` : "—",
          change: "Across exams",
          tone: "success",
        },
        {
          icon: Trophy,
          label: "Best result",
          value: results.length
            ? `${Math.max(
                ...results.map((result) =>
                  result.total
                    ? Math.round((result.score / result.total) * 100)
                    : 0,
                ),
              )}%`
            : "—",
          change: "Highest percentage",
          tone: "secondary",
        },
      ]}
    >
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading your results...
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-6 text-sm font-semibold text-red-700">
          {error.response?.data?.error || "Your results could not be loaded."}
        </div>
      ) : results.length ? (
        <div className="space-y-5">
          {results.map((result) => {
            const scoreboard = result.scoreboard || [];
            const topThree = scoreboard.slice(0, 3);
            const percentage = result.total
              ? Math.round((result.score / result.total) * 100)
              : 0;

            return (
              <article
                key={result.roomCode}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <header className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {result.subject || "Exam"} · {result.roomCode}
                    </p>
                    <h2 className="mt-1 truncate text-lg font-black text-slate-900">
                      {result.roomTitle}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Submitted{" "}
                      {new Date(result.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-primary/5 px-4 py-3">
                    <div className="text-right">
                      <p className="text-xl font-black text-primary">
                        {result.score} / {result.total}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {percentage}% · Rank #{result.rank}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="grid gap-5 p-5">
                  <section>
                    <div className="mb-3 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <h3 className="text-sm font-black text-slate-800">
                        Top performers
                      </h3>
                    </div>
                    {topThree.length ? (
                      <div className="grid gap-3 md:grid-cols-3">
                        {topThree.map((student, index) => (
                          <div
                            key={student.studentEmail}
                            className={`flex items-center gap-3 rounded-xl border p-3 ${rankStyles[index]}`}
                          >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/80 text-xs font-black">
                              {index + 1}
                            </span>
                            <StudentAvatar student={student} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black">
                                {student.studentName}
                              </p>
                              <p className="text-xs font-bold">
                                {student.score} / {student.total}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No scoreboard entries yet.
                      </p>
                    )}
                  </section>

                  <section className="overflow-hidden rounded-xl border border-slate-100">
                    <h3 className="border-b border-slate-100 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                      Scoreboard
                    </h3>
                    {scoreboard.length ? (
                      <ol className="divide-y divide-slate-100">
                        {scoreboard.map((student, index) => {
                          const isMe =
                            student.studentEmail?.toLowerCase() ===
                            user?.email?.toLowerCase();
                          return (
                            <li
                              key={student.studentEmail}
                              className={`flex items-center gap-3 px-4 py-3 ${
                                isMe ? "bg-primary/5" : ""
                              }`}
                            >
                              <span className="w-8 text-xs font-black text-slate-400">
                                #{index + 1}
                              </span>
                              <StudentAvatar student={student} size="h-8 w-8" />
                              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                                {student.studentName}
                                {isMe && (
                                  <span className="ml-2 text-xs text-primary">
                                    You
                                  </span>
                                )}
                              </span>
                              <span className="text-sm font-black text-slate-800">
                                {student.score} / {student.total}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <p className="px-4 py-5 text-sm text-slate-500">
                        No scoreboard entries yet.
                      </p>
                    )}
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
          <Trophy className="mx-auto h-8 w-8 text-slate-300" />
          <h2 className="mt-3 text-lg font-black text-slate-900">
            No results yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            After you submit an exam, your marks and its scoreboard will appear
            here.
          </p>
          <Link
            to="/student/exams/join"
            className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            View assigned exams
          </Link>
        </div>
      )}
    </DashboardShell>
  );
};

export default StudentResults;
