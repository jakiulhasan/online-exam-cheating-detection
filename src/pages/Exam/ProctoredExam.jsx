import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Maximize,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ListChecks,
  MessageCircle,
  Send,
} from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useProctoring from "../../hooks/useProctoring";
import WebcamMonitor from "../../components/exam/WebcamMonitor";

const MAX_VIOLATIONS = 5;

const optionLabel = (index) => {
  let label = "";
  let value = index + 1;
  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
};

const violationLabel = {
  "tab-hidden": "Tab switch",
  "window-blur": "Window blur",
  "fullscreen-exit": "Fullscreen exit",
  "context-menu": "Right-click",
  copy: "Copy",
  paste: "Paste",
  cut: "Cut",
  "key-combo": "Shortcut",
  devtools: "DevTools",
};

const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const ProctoredExam = () => {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [chatDraft, setChatDraft] = useState("");
  const [unreadNotices, setUnreadNotices] = useState(0);
  const noticeCountRef = useRef(null);
  const chatEndRef = useRef(null);
  const {
    data: room,
    isLoading: roomLoading,
    isError: roomError,
  } = useQuery({
    queryKey: ["room-detail", roomId],
    enabled: !!user?.email && !!roomId,
    staleTime: 0,
    queryFn: async () =>
      (await axiosSecure.get(`/rooms/${encodeURIComponent(roomId)}`)).data,
    refetchInterval: (query) =>
      query.state.data?.status === "completed" ? false : 1500,
    refetchIntervalInBackground: true,
  });
  const sendChat = useMutation({
    mutationFn: (message) =>
      axiosSecure.post(`/rooms/${roomId}/chat`, { message }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["room-detail", roomId] }),
  });
  const examSeconds = Math.max(1, Number(room?.durationMinutes) || 60) * 60;
  const roomStarted = room?.status === "in-progress";
  const examQuestions = useMemo(
    () =>
      (room?.questions || []).map((question) => ({
        q: question.question || question.q,
        choices: question.options || question.choices || [],
      })),
    [room],
  );
  const notices = room?.notices || [];
  const messages = (room?.chat || []).map((message) => ({
    ...message,
    from:
      message.senderEmail?.toLowerCase() === user?.email?.toLowerCase()
        ? "me"
        : "teacher",
    name:
      message.senderName ||
      message.senderEmail?.split("@")[0] ||
      (message.senderRole === "teacher" ? "Teacher" : "Student"),
  }));
  const chatEnabled = room?.chatEnabled !== false;

  const [phase, setPhase] = useState("exam"); // exam | result
  const [answers, setAnswers] = useState({}); // { questionIndex: choiceIndex }
  const [current, setCurrent] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [toasts, setToasts] = useState([]);
  const [result, setResult] = useState(null); // { score, total, reason, violations }

  const submittedRef = useRef(false);
  // Authoritative copies read at submit time — immune to React state batching,
  // so the auto-submit boundary logs the correct violations/score.
  const answersRef = useRef({});
  const violationsRef = useRef([]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!room?.notices) return;
    if (noticeCountRef.current !== null && room.notices.length > noticeCountRef.current) {
      setUnreadNotices(
        (count) => count + room.notices.length - noticeCountRef.current,
      );
    }
    noticeCountRef.current = room.notices.length;
  }, [room?.notices]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.chat]);

  const pushToast = useCallback((msg, tone = "warning") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  // Best-effort backend log — never blocks or breaks the exam.
  const logViolation = useCallback(
    (entry) => {
      axiosSecure
        .post(`/exams/${roomId}/violations`, {
          type: entry.type,
          detail: entry.detail,
          ts: entry.ts,
        })
        .catch(() => {});
    },
    [axiosSecure, roomId],
  );

  const { count, isFullscreen, requestFullscreen, exitFullscreen } =
    useProctoring({
      active: phase === "exam",
      maxViolations: MAX_VIOLATIONS,
      onViolation: (entry, currentCount) => {
        violationsRef.current = [...violationsRef.current, entry];
        pushToast(`${entry.detail} (${currentCount}/${MAX_VIOLATIONS})`);
        logViolation(entry);
      },
      onLimitReached: () => {
        finishExam("auto");
      },
    });

  // finishExam reads answers/violations from refs so it is always accurate,
  // even when fired synchronously the moment the violation limit is hit.
  const finishExam = useCallback(
    async (reason) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      const finalAnswers = answersRef.current;
      setPhase("submitting");
      try {
        const { data } = await axiosSecure.post(`/rooms/${roomId}/submit`, {
          answers: finalAnswers,
          reason,
        });
        setResult({
          score: data.score,
          total: data.total,
          reason,
          violations: violationsRef.current,
        });
      } catch (error) {
        setResult({
          score: null,
          total: examQuestions.length,
          reason,
          violations: violationsRef.current,
          submissionError:
            error.response?.data?.error ||
            "Your answers could not be scored. Contact your teacher.",
        });
      }
      setPhase("result");
      exitFullscreen();
    },
    [axiosSecure, examQuestions.length, exitFullscreen, roomId],
  );

  useEffect(() => {
    if (room?.status !== "completed" || phase !== "exam") return;
    finishExam("time");
  }, [finishExam, phase, room?.status]);

  // Countdown timer.
  useEffect(() => {
    if (phase !== "exam" || !roomStarted) return;
    const roomStart = Date.parse(room?.startedAt || "");
    const deadline = Number.isNaN(roomStart)
      ? Date.now() + examSeconds * 1000
      : roomStart + examSeconds * 1000;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) finishExam("time");
    };
    const initialTick = setTimeout(updateCountdown, 0);
    const interval = setInterval(updateCountdown, 1000);
    return () => {
      clearTimeout(initialTick);
      clearInterval(interval);
    };
  }, [examSeconds, finishExam, phase, room?.startedAt, roomStarted]);

  const selectAnswer = (choiceIdx) =>
    setAnswers((a) => ({ ...a, [current]: choiceIdx }));

  const submitChatMessage = (event) => {
    event.preventDefault();
    const message = chatDraft.trim();
    if (!message || !chatEnabled || sendChat.isPending) return;
    sendChat.mutate(message, {
      onSuccess: () => setChatDraft(""),
    });
  };

  if (roomLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200 p-4 text-sm font-semibold text-base-content/60">
        Checking exam access...
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200 p-4">
        <div className="max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 text-center shadow-xl">
          <h1 className="text-xl font-black">Exam access unavailable</h1>
          <p className="mt-2 text-sm text-base-content/60">
            Join an exam assigned to your Gmail account before opening it.
          </p>
          <Link
            to="/student/exams/join"
            className="btn btn-primary mt-5 text-white"
          >
            Back to Join exam
          </Link>
        </div>
      </div>
    );
  }

  if (room.status === "completed" && phase === "exam") {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200 p-4 text-sm font-semibold text-base-content/60">
        Exam time is over. Submitting your answers...
      </div>
    );
  }

  if (!roomStarted && room.status !== "completed") {
    return <Navigate to={`/exam/${roomId}/live`} replace />;
  }

  if (!examQuestions.length && room.status !== "completed") {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200 p-4">
        <div className="max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 text-center shadow-xl">
          <h1 className="text-xl font-black">Questions are unavailable</h1>
          <p className="mt-2 text-sm text-base-content/60">
            This exam room has no saved questions. Return to your assigned
            exams and open the correct room, or contact your teacher.
          </p>
          <Link
            to="/student/exams/join"
            className="btn btn-primary mt-5 text-white"
          >
            Back to assigned exams
          </Link>
        </div>
      </div>
    );
  }

  // ============================ RESULT ============================
  if (phase === "submitting") {
    return (
      <div className="grid min-h-screen place-items-center bg-base-200 p-4 text-sm font-semibold text-base-content/60">
        Submitting your answers...
      </div>
    );
  }

  if (phase === "result") {
    const passed =
      result.score !== null && result.score / result.total >= 0.6;
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border border-base-300 rounded-3xl p-8">
          <div className="text-center">
            <div
              className={`inline-flex p-3 rounded-2xl ${
                passed ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}
            >
              {passed ? (
                <CheckCircle2 className="w-9 h-9" />
              ) : (
                <XCircle className="w-9 h-9" />
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-3">
              {result.score === null
                ? "Score unavailable"
                : `${result.score} / ${result.total}`}
            </h1>
            {result.submissionError && (
              <p role="alert" className="mt-2 text-sm text-error">
                {result.submissionError}
              </p>
            )}
            <p className="text-sm text-base-content/60 mt-1">
              {result.reason === "auto" &&
                "Auto-submitted — violation limit reached."}
              {result.reason === "time" && "Time's up — exam submitted."}
              {result.reason === "manual" && "Exam submitted. Well done!"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 my-6">
            <div className="bg-base-200/60 border border-base-300 rounded-2xl p-4 text-center">
              <div className="text-2xl font-extrabold text-primary">
                {result.score === null
                  ? "—"
                  : `${Math.round((result.score / result.total) * 100)}%`}
              </div>
              <div className="text-xs text-base-content/60 mt-0.5">Score</div>
            </div>
            <div className="bg-base-200/60 border border-base-300 rounded-2xl p-4 text-center">
              <div
                className={`text-2xl font-extrabold ${
                  result.violations.length ? "text-error" : "text-success"
                }`}
              >
                {result.violations.length}
              </div>
              <div className="text-xs text-base-content/60 mt-0.5">
                Violations
              </div>
            </div>
          </div>

          {result.violations.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center gap-2 font-bold text-sm mb-2">
                <ListChecks className="w-4 h-4 text-error" /> Violation log
              </h3>
              <div className="max-h-52 overflow-auto rounded-2xl border border-base-300 divide-y divide-base-200">
                {result.violations.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="badge badge-error badge-sm text-white">
                        {violationLabel[v.type] || v.type}
                      </span>
                      <span className="text-base-content/70">{v.detail}</span>
                    </span>
                    <span className="text-xs text-base-content/40 font-mono">
                      {new Date(v.ts).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/student/exams/join")}
              className="btn btn-primary rounded-xl flex-1 gap-2 text-white"
            >
              Back to assigned exams <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================ EXAM ============================
  const q = examQuestions[current];
  const answeredCount = Object.keys(answers).length;
  const dangerTime = secondsLeft <= 30;

  return (
    <div className="min-h-screen bg-base-200 select-none">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-base-100/90 backdrop-blur-md border-b border-base-300 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-black tracking-tight">
          <div className="p-1.5 bg-gradient-to-br from-primary to-secondary text-primary-content rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">MedhaGuard Exam</span>
          <span className="font-mono text-xs text-base-content/50">
            #{roomId}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button
              onClick={requestFullscreen}
              className="btn btn-xs btn-warning rounded-lg gap-1"
            >
              <Maximize className="w-3 h-3" /> Re-enter fullscreen
            </button>
          )}
          <div
            className={`flex items-center gap-1.5 font-mono font-bold px-3 py-1.5 rounded-lg ${
              dangerTime
                ? "bg-error/15 text-error animate-pulse"
                : "bg-base-200 text-base-content"
            }`}
          >
            <Clock className="w-4 h-4" /> {fmtTime(secondsLeft)}
          </div>
          <div
            className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-lg ${
              count > 0
                ? "bg-error/15 text-error"
                : "bg-success/15 text-success"
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> {count}/{MAX_VIOLATIONS}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card bg-base-100 border border-base-300 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                Question {current + 1} of {examQuestions.length}
              </span>
              <span className="text-xs text-base-content/50">
                {answeredCount} answered
              </span>
            </div>
            <h2 className="text-lg font-bold leading-snug mb-5">{q.q}</h2>

            <div className="space-y-2.5">
              {q.choices.map((c, i) => {
                const selected = answers[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                      selected
                        ? "border-primary bg-primary/10 font-semibold text-primary"
                        : "border-base-300 hover:border-base-content/30 hover:bg-base-200/50"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 grid place-items-center rounded-full text-xs font-bold shrink-0 ${
                        selected
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 text-base-content/60"
                      }`}
                    >
                      {optionLabel(i)}
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="btn btn-ghost rounded-xl"
            >
              Previous
            </button>
            {current < examQuestions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrent((c) => Math.min(examQuestions.length - 1, c + 1))
                }
                className="btn btn-primary rounded-xl gap-2 text-white"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => finishExam("manual")}
                className="btn btn-success rounded-xl gap-2 text-white"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Exam
              </button>
            )}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-5">
          <WebcamMonitor active={phase === "exam"} />

          <div className="card bg-base-100 border border-base-300 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3">
              Question navigator
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {examQuestions.map((_, i) => {
                const done = answers[i] !== undefined;
                const active = i === current;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`aspect-square rounded-lg text-sm font-bold border transition-all ${
                      active
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-base-300"
                    } ${
                      done
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content/60"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <section className="card bg-base-100 border border-base-300 rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/50">
                Teacher notices
              </h3>
              {unreadNotices > 0 && (
                <button
                  type="button"
                  className="badge badge-error gap-1 text-white"
                  onClick={() => setUnreadNotices(0)}
                  aria-label="Mark teacher notices as read"
                >
                  {unreadNotices} new
                </button>
              )}
            </div>
            <ul className="max-h-36 space-y-2 overflow-auto">
              {notices.map((notice) => (
                <li
                  key={notice.id}
                  className="rounded-lg bg-primary/10 px-3 py-2 text-sm"
                >
                  <p>{notice.text}</p>
                  {notice.createdAt && (
                    <time className="mt-1 block text-right text-xs text-base-content/50">
                      {new Date(notice.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  )}
                </li>
              ))}
              {!notices.length && (
                <li className="text-sm text-base-content/50">
                  No teacher notices yet.
                </li>
              )}
            </ul>
          </section>

          <section className="card bg-base-100 border border-base-300 rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/50">
                <MessageCircle className="h-4 w-4" /> Live chat
              </h3>
              <span
                className={`badge ${chatEnabled ? "badge-success" : "badge-ghost"}`}
              >
                {chatEnabled ? "On" : "Off"}
              </span>
            </div>
            <div className="max-h-56 min-h-20 space-y-2 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                    message.from === "me"
                      ? "ml-auto bg-primary text-primary-content"
                      : "bg-base-200"
                  }`}
                >
                  <p className="mb-0.5 text-[10px] font-bold opacity-70">
                    {message.from === "me" ? "You" : message.name}
                  </p>
                  <p className="break-words">{message.text}</p>
                </div>
              ))}
              {!messages.length && (
                <p className="text-sm text-base-content/50">
                  {chatEnabled ? "No messages yet." : "Your teacher turned chat off."}
                </p>
              )}
              <div ref={chatEndRef} />
            </div>
            {sendChat.isError && (
              <p role="alert" className="mt-2 text-xs text-error">
                {sendChat.error.response?.data?.error ||
                  "Message could not be sent."}
              </p>
            )}
            <form onSubmit={submitChatMessage} className="mt-3 flex gap-2">
              <input
                value={chatDraft}
                onChange={(event) => setChatDraft(event.target.value)}
                disabled={!chatEnabled || sendChat.isPending}
                aria-label="Chat message"
                placeholder={chatEnabled ? "Type a message" : "Chat is off"}
                className="input input-bordered input-sm min-w-0 flex-1"
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!chatEnabled || !chatDraft.trim() || sendChat.isPending}
                aria-label="Send chat message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </section>

          <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 text-xs text-base-content/60 flex items-start gap-2">
            <Lock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            Stay in fullscreen and keep this the only open tab. Violations are
            logged live to your supervisor.
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="alert alert-warning rounded-xl shadow-lg text-sm py-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProctoredExam;
