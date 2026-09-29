import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Copy,
  DoorOpen,
  FilePlus2,
} from "lucide-react";
import { Link } from "react-router";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const initialForm = {
  title: "",
  subject: "",
  scheduledAt: "",
  durationMinutes: "60",
  instructions: "",
  allowedEmails: "",
};

const gmailPattern = /^[^\s@]+@gmail\.com$/i;

const CreateExam = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () =>
      (await axiosSecure.get(`/users/${encodeURIComponent(user.email)}`)).data,
  });
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms", user?.email],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get("/rooms")).data,
  });
  const createExam = useMutation({
    mutationFn: (exam) => axiosSecure.post("/rooms", exam),
    onSuccess: () => {
      setForm(initialForm);
      setFormError("");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      setFormError(
        error.response?.data?.error || "Exam could not be created. Try again.",
      );
    },
  });

  const createdExams = rooms.filter(
    (room) => room.teacherEmail?.toLowerCase() === user?.email?.toLowerCase(),
  );
  const updateForm = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const submitExam = (event) => {
    event.preventDefault();
    setFormError("");
    const allowedStudentEmails = [
      ...new Set(
        form.allowedEmails
          .split(/[\s,;]+/)
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
    if (allowedStudentEmails.some((email) => !gmailPattern.test(email))) {
      setFormError("Every allowed address must be a valid @gmail.com account.");
      return;
    }

    createExam.mutate({
      title: form.title.trim(),
      subject: form.subject.trim(),
      type: "MCQ",
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMinutes: Number(form.durationMinutes),
      instructions: form.instructions.trim(),
      allowedStudentEmails,
    });
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      setCopiedCode("");
    }
  };

  const name = profile?.name || user?.displayName || "Teacher";
  const email = profile?.email || user?.email || "-";

  return (
    <DashboardShell
      role="teacher"
      profile={{ name, email, joined: "" }}
      eyebrow="Teacher workspace"
      title="Create exam"
      description="Set the exam schedule and choose invited students, or leave the invite list empty to allow anyone with the room code."
      primaryAction={{ to: "/teacher/exams/create", label: "Create exam" }}
      secondaryAction={{ to: "/profile/teacher", label: "Overview" }}
      stats={[]}
    >
      <section className="surface overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-black text-slate-900">
            <FilePlus2 className="h-4 w-4 text-secondary" /> Exam details
          </h2>
        </div>
        <form onSubmit={submitExam} className="grid gap-5 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              Exam title
              <input
                required
                maxLength={100}
                value={form.title}
                onChange={updateForm("title")}
                placeholder="e.g. Biology midterm"
                className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-secondary"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              Subject
              <input
                required
                maxLength={80}
                value={form.subject}
                onChange={updateForm("subject")}
                placeholder="e.g. Biology"
                className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-secondary"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              Date and start time
              <span className="relative">
                <CalendarClock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={updateForm("scheduledAt")}
                  className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm font-medium outline-none focus:border-secondary"
                />
              </span>
            </label>
            <label className="grid gap-1.5 text-xs font-bold text-slate-700">
              Duration (minutes)
              <span className="relative">
                <Clock3 className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  required
                  type="number"
                  min="1"
                  max="360"
                  value={form.durationMinutes}
                  onChange={updateForm("durationMinutes")}
                  className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm font-medium outline-none focus:border-secondary"
                />
              </span>
            </label>
          </div>
          <label className="grid gap-1.5 text-xs font-bold text-slate-700">
            Instructions{" "}
            <span className="font-medium text-slate-400">(optional)</span>
            <textarea
              rows={3}
              maxLength={1000}
              value={form.instructions}
              onChange={updateForm("instructions")}
              placeholder="Add any instructions students should see before starting."
              className="resize-y rounded-lg border border-slate-200 p-3 text-sm font-medium outline-none focus:border-secondary"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-bold text-slate-700">
            Allowed student Gmail addresses{" "}
            <span className="font-medium text-slate-400">(optional)</span>
            <textarea
              rows={4}
              value={form.allowedEmails}
              onChange={updateForm("allowedEmails")}
              placeholder="Leave blank to allow anyone with the room code"
              className="resize-y rounded-lg border border-slate-200 p-3 font-mono text-sm font-medium outline-none focus:border-secondary"
            />
            <span className="font-medium text-slate-500">
              Add Gmail addresses separated by commas or new lines. If left
              blank, any student with the room code can join.
            </span>
          </label>
          {formError && (
            <p role="alert" className="text-sm font-semibold text-red-700">
              {formError}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={createExam.isPending}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-secondary px-5 text-sm font-bold text-white transition hover:brightness-95 disabled:opacity-50"
            >
              <FilePlus2 className="h-4 w-4" />
              {createExam.isPending ? "Creating..." : "Create exam"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-black text-slate-900">Your exams</h2>
          <span className="text-xs font-semibold text-slate-400">
            {createdExams.length}
          </span>
        </div>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          {createdExams.map((exam) => (
            <article
              key={exam.code}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black text-slate-900">
                  {exam.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {exam.subject} · {exam.durationMinutes} min ·{" "}
                  {exam.students?.length || 0} joined
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(exam.scheduledAt).toLocaleString()} ·{" "}
                  {exam.allowedStudentEmails?.length
                    ? `${exam.allowedStudentEmails.length} invited`
                    : "Anyone with code can join"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-600">
                  {exam.code}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(exam.code)}
                  title="Copy exam code"
                  aria-label={`Copy code for ${exam.title}`}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {copiedCode === exam.code ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <Link
                  to={`/exam/${exam.code}/teacher`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-xs font-bold text-white hover:brightness-95"
                >
                  <DoorOpen className="h-4 w-4" /> Join room
                </Link>
              </div>
            </article>
          ))}
          {!createdExams.length && (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No exams created yet.
            </p>
          )}
        </div>
      </section>
    </DashboardShell>
  );
};

export default CreateExam;
