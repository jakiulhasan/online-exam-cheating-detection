import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

/**
 * TeacherWaitingRoom
 * Teacher side before the exam starts: student grid, Add Question / Start Exam,
 * self view, notice composer, chat with on/off control.
 *
 * Rule: Start Exam stays disabled until questionsSubmitted is true.
 *
 * Props (all optional, demo defaults included):
 *  - students:           [{ id, name, online, stream }]  stream = MediaStream (optional)
 *  - questionsSubmitted: boolean
 *  - onAddQuestion()     optional custom add-question handler
 *  - onStartExam()
 *  - onOpenStudent(id)   called on double tap / double click of a tile
 *  - notices:            [{ id, text, time }]  already sent notices
 *  - onSendNotice(text)
 *  - chatEnabled, onToggleChat(nextValue)
 *  - messages:           [{ id, from, text }]
 *  - onSendMessage(text)
 */
const demoStudents = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  online: i !== 4,
}));

const blankQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  answer: 0,
});

const demoQuestions = [
  {
    question: "Which data structure follows the Last In, First Out (LIFO) principle?",
    options: ["Queue", "Stack", "Linked list", "Heap"],
    answer: 1,
  },
  {
    question: "What is the worst-case time complexity of binary search on a sorted array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    answer: 1,
  },
  {
    question: "Which key uniquely identifies a row in a relational database table?",
    options: ["Foreign key", "Candidate value", "Primary key", "Index key"],
    answer: 2,
  },
  {
    question: "Which OSI model layer is responsible for routing packets between networks?",
    options: ["Data Link", "Network", "Transport", "Session"],
    answer: 1,
  },
  {
    question: "Which scheduling algorithm gives each process a fixed time slice?",
    options: ["First Come, First Served", "Shortest Job First", "Priority Scheduling", "Round Robin"],
    answer: 3,
  },
  {
    question: "Which traversal of a binary search tree visits keys in sorted order?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    answer: 1,
  },
  {
    question: "Which normal form eliminates partial dependency on a composite key?",
    options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
    answer: 1,
  },
  {
    question: "What is the main purpose of a compiler?",
    options: [
      "Translate source code into a lower-level or machine-readable form",
      "Store application data permanently",
      "Route requests across a network",
      "Schedule CPU processes",
    ],
    answer: 0,
  },
  {
    question: "Which protocol provides reliable, connection-oriented data delivery?",
    options: ["IP", "UDP", "TCP", "ARP"],
    answer: 2,
  },
  {
    question: "In a max-heap, where is the largest element always located?",
    options: ["At the root", "At the leftmost leaf", "At the rightmost leaf", "At any leaf"],
    answer: 0,
  },
];

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

export default function TeacherWaitingRoom({
  students: providedStudents,
  questionsSubmitted: providedQuestionsSubmitted,
  onAddQuestion,
  onStartExam,
  onOpenStudent = () => {},
  notices: providedNotices,
  onSendNotice,
  chatEnabled: providedChatEnabled,
  onToggleChat,
  messages: providedMessages,
  onSendMessage,
}) {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const [camError, setCamError] = useState(false);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState("");
  const [questionDialog, setQuestionDialog] = useState(null);
  const [draftQuestions, setDraftQuestions] = useState([]);
  const [questionError, setQuestionError] = useState("");
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room-detail", roomId],
    enabled: !!user?.email && !!roomId,
    queryFn: async () =>
      (await axiosSecure.get(`/rooms/${encodeURIComponent(roomId)}`)).data,
    refetchInterval: (query) =>
      query.state.data?.status === "completed" ? false : 1500,
    refetchIntervalInBackground: true,
  });
  const refreshRoom = () =>
    queryClient.invalidateQueries({ queryKey: ["room-detail", roomId] });
  const startExam = useMutation({
    mutationFn: () => axiosSecure.post(`/rooms/${roomId}/start`),
    onSuccess: refreshRoom,
  });
  const saveQuestions = useMutation({
    mutationFn: (questions) =>
      axiosSecure.post(`/rooms/${roomId}/questions`, { questions }),
    onSuccess: () => {
      refreshRoom();
      setQuestionDialog(null);
      setQuestionError("");
    },
    onError: (error) =>
      setQuestionError(
        error.response?.data?.error || "Questions could not be saved.",
      ),
  });
  const sendNotice = useMutation({
    mutationFn: (text) => axiosSecure.post(`/rooms/${roomId}/notice`, { text }),
    onSuccess: refreshRoom,
  });
  const sendMessage = useMutation({
    mutationFn: (message) =>
      axiosSecure.post(`/rooms/${roomId}/chat`, { message }),
    onSuccess: refreshRoom,
  });
  const setChatStatus = useMutation({
    mutationFn: (enabled) =>
      axiosSecure.post(`/rooms/${roomId}/chat-status`, { enabled }),
    onSuccess: refreshRoom,
  });
  const liveStudents = (room?.students || []).map((student) => ({
    id: student.email,
    name: student.name || student.email,
    online: true,
    photoURL: student.photoURL,
  }));
  const liveNotices = (room?.notices || []).map((item) => ({
    id: item.id,
    text: item.text,
    time: item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  }));
  const liveMessages = (room?.chat || []).map((item) => ({
    id: item.id,
    from:
      item.senderEmail?.toLowerCase() === user?.email?.toLowerCase()
        ? "me"
        : item.senderRole,
    name: item.senderName || item.senderEmail?.split("@")[0] || "Student",
    photoURL: item.senderPhotoURL || null,
    text: item.text,
  }));
  const students = providedStudents ?? (room ? liveStudents : demoStudents);
  const notices = providedNotices ?? liveNotices;
  const messages = providedMessages ?? liveMessages;
  const chatEnabled = providedChatEnabled ?? room?.chatEnabled !== false;
  const questionCount = room?.questions?.length || 0;
  const questionsSubmitted = providedQuestionsSubmitted ?? questionCount > 0;
  const examStarted = room?.status === "in-progress";
  const examEnded = room?.status === "completed";

  const openQuestionDialog = () => {
    const savedQuestions = (room?.questions || []).map((item) => ({
      question: item.question || item.q || "",
      options: [...(item.options || item.choices || ["", "", "", ""])],
      answer: Number.isInteger(item.answer) ? item.answer : 0,
    }));
    setDraftQuestions(savedQuestions.length ? savedQuestions : [blankQuestion()]);
    setQuestionError("");
    setQuestionDialog("choose");
  };

  const fillDemoQuestions = () => {
    setDraftQuestions(demoQuestions.map((question) => ({
      ...question,
      options: [...question.options],
    })));
    setQuestionError("");
    setQuestionDialog("create");
  };

  const updateQuestion = (questionIndex, update) => {
    setDraftQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex ? { ...question, ...update } : question,
      ),
    );
  };

  const addQuestion = () =>
    setDraftQuestions((current) => [...current, blankQuestion()]);

  const addOption = (questionIndex) =>
    setDraftQuestions((current) =>
      current.map((question, index) =>
        index === questionIndex
          ? { ...question, options: [...question.options, ""] }
          : question,
      ),
    );

  const removeOption = (questionIndex, optionIndex) =>
    setDraftQuestions((current) =>
      current.map((question, index) => {
        if (index !== questionIndex || question.options.length <= 2) {
          return question;
        }
        const options = question.options.filter((_, i) => i !== optionIndex);
        const answer =
          question.answer === optionIndex
            ? Math.min(optionIndex, options.length - 1)
            : question.answer > optionIndex
              ? question.answer - 1
              : question.answer;
        return { ...question, options, answer };
      }),
    );

  const submitQuestions = (event) => {
    event.preventDefault();
    setQuestionError("");
    saveQuestions.mutate(
      draftQuestions.map((question) => ({
        question: question.question.trim(),
        options: question.options.map((option) => option.trim()),
        answer: question.answer,
      })),
    );
  };

  const handleStartExam = () => {
    if (!window.confirm("Are you sure you want to start this exam now?")) return;
    if (onStartExam) onStartExam();
    else startExam.mutate();
  };

  useEffect(() => {
    let stream;
    navigator.mediaDevices
      ?.getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCamError(true));
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const postNotice = (e) => {
    e.preventDefault();
    const text = notice.trim();
    if (!text) return;
    if (onSendNotice) onSendNotice(text);
    else sendNotice.mutate(text);
    setNotice("");
  };

  const sendChat = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !chatEnabled) return;
    if (onSendMessage) onSendMessage(text);
    else sendMessage.mutate(text);
    setDraft("");
  };

  if (isLoading) {
    return (
      <main className="twr twr-state">Connecting to your exam room...</main>
    );
  }

  if (isError || !room) {
    return (
      <main className="twr twr-state">
        Room unavailable. <Link to="/teacher/exams/create">Back to exams</Link>
      </main>
    );
  }

  const online = students.filter((s) => s.online).length;
  const lastNotice = notices[notices.length - 1];

  return (
    <div className="twr">
      <style>{css}</style>

      <header className="twr-head">
        <div>
          <span className="twr-title">{room.title} · Teacher room</span>
          <span className="twr-sub">
            {room.subject} · {room.code}
          </span>
        </div>
        <Link className="twr-back" to="/teacher/exams/create">
          Back to exams
        </Link>
      </header>

      <div className="twr-grid">
        {/* Student grid */}
        <section className="twr-card twr-students">
          <div className="twr-card-head">
            <h2>Students</h2>
            <span className="twr-count">
              {online} of {students.length} joined
            </span>
          </div>
          {students.length === 0 ? (
            <p className="twr-empty">
              No students have joined yet. They will appear here as they join.
            </p>
          ) : (
            <div className="twr-tiles">
              {students.map((s) => (
                <StudentTile
                  key={s.id}
                  student={s}
                  onOpen={() => onOpenStudent(s.id)}
                />
              ))}
            </div>
          )}
          <p className="twr-muted">
            Students appear here as they enter the room.
          </p>
        </section>

        <aside className="twr-side">
          {/* Exam controls */}
          <section className="twr-card twr-controls">
            <div className="twr-control-actions">
              <button
                className="twr-secondary"
                onClick={onAddQuestion || openQuestionDialog}
                disabled={examStarted || examEnded}
              >
                Add question
              </button>
              <button
                className="twr-secondary"
                onClick={fillDemoQuestions}
                disabled={examStarted || examEnded}
              >
                Demo questions
              </button>
            </div>
            <button
              className="twr-primary"
              onClick={handleStartExam}
              disabled={
                !questionsSubmitted ||
                startExam.isPending ||
                examStarted ||
                examEnded
              }
            >
              {examEnded
                ? "Exam ended"
                : examStarted
                ? "Exam started"
                : startExam.isPending
                  ? "Starting..."
                  : "Start exam"}
            </button>
            <p className={`twr-muted ${questionsSubmitted ? "ok" : ""}`}>
              {examEnded
                ? "Exam time is over. Students have been removed from the room."
                : examStarted
                ? "All students have been sent to the exam."
                : questionsSubmitted
                  ? `${questionCount} question${questionCount === 1 ? "" : "s"} ready. Start when all students have joined.`
                  : "Submit your questions to enable Start exam."}
            </p>
            {startExam.isError && (
              <p className="twr-error">
                {startExam.error.response?.data?.error ||
                  "Exam could not start."}
              </p>
            )}
          </section>

          {/* Self view */}
          <section className="twr-card twr-self">
            {camError ? (
              <div className="twr-cam-off">
                Camera unavailable. Allow camera access in your browser.
              </div>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline />
            )}
            <span className="twr-tag">You</span>
          </section>

          {/* Notice composer */}
          <section className="twr-card twr-notice">
            <h2>Notice to students</h2>
            <form onSubmit={postNotice}>
              <textarea
                rows={2}
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                placeholder="Type a notice"
                aria-label="Notice"
              />
              <button type="submit" disabled={!notice.trim()}>
                Send notice
              </button>
            </form>
            {lastNotice && (
              <p className="twr-muted">Last sent: {lastNotice.text}</p>
            )}
          </section>

          {/* Chat */}
          <section
            className={`twr-card twr-chat ${chatEnabled ? "" : "is-off"}`}
          >
            <div className="twr-card-head">
              <h2>Chat</h2>
              <label className="twr-switch">
                <input
                  type="checkbox"
                  role="switch"
                  checked={chatEnabled}
                  onChange={(e) =>
                    onToggleChat
                      ? onToggleChat(e.target.checked)
                      : setChatStatus.mutate(e.target.checked)
                  }
                  disabled={setChatStatus.isPending}
                />
                <span className="twr-track" />
                <span className="twr-switch-label">
                  {chatEnabled ? "On" : "Off"}
                </span>
              </label>
            </div>
            <div className="twr-msgs">
              {messages.length === 0 && (
                <p className="twr-muted">
                  {chatEnabled
                    ? "No messages yet."
                    : "Chat is off for students."}
                </p>
              )}
              {messages.map((m) => {
                const name =
                  m.name ||
                  m.senderName ||
                  (m.from === "me"
                    ? user?.displayName || user?.email?.split("@")[0]
                    : "Student");
                const photoURL =
                  m.photoURL ||
                  m.senderPhotoURL ||
                  (m.from === "me" ? user?.photoURL : null);

                return (
                  <div
                    key={m.id}
                    className={`twr-msg-row ${m.from === "me" ? "me" : ""}`}
                  >
                    <span
                      className="twr-msg-avatar"
                      title={name}
                      aria-label={`Message from ${name}`}
                    >
                      {photoURL && (
                        <img
                          src={photoURL}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.nextElementSibling.style.display =
                              "grid";
                          }}
                        />
                      )}
                      <span
                        className="twr-msg-avatar-fallback"
                        style={{ display: photoURL ? "none" : "grid" }}
                      >
                        {name.trim().split(/\s+/)[0] || "?"}
                      </span>
                    </span>
                    <div className="twr-msg">{m.text}</div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendChat}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  chatEnabled ? "Type a message" : "Turn chat on to send"
                }
                disabled={!chatEnabled}
                aria-label="Message"
              />
              <button type="submit" disabled={!chatEnabled || !draft.trim()}>
                Send
              </button>
            </form>
          </section>
        </aside>
      </div>

      {questionDialog && (
        <div
          className="twr-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setQuestionDialog(null);
              setQuestionError("");
            }
          }}
        >
          <section
            className="twr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="twr-question-title"
          >
            <header className="twr-modal-head">
              <div>
                <h2 id="twr-question-title">
                  {questionDialog === "choose"
                    ? "Add question"
                    : "Create questions"}
                </h2>
                <p>
                  {questionDialog === "choose"
                    ? "Choose how you want to add questions."
                    : "Write your questions, options, and correct answers."}
                </p>
              </div>
              <button
                type="button"
                className="twr-modal-close"
                aria-label="Close"
                onClick={() => {
                  setQuestionDialog(null);
                  setQuestionError("");
                }}
              >
                ×
              </button>
            </header>

            {questionDialog === "choose" ? (
              <div className="twr-question-choices">
                <button
                  type="button"
                  className="twr-question-choice"
                  onClick={() => setQuestionDialog("create")}
                >
                  <strong>Create Question</strong>
                  <span>Create questions and enter options manually.</span>
                </button>
                <button
                  type="button"
                  className="twr-question-choice locked"
                  disabled
                >
                  <strong>
                    Upload Question <span className="twr-lock">Locked</span>
                  </strong>
                  <span>Premium User · Coming soon</span>
                </button>
              </div>
            ) : (
              <form className="twr-question-form" onSubmit={submitQuestions}>
                <div className="twr-question-list">
                  {draftQuestions.map((question, questionIndex) => (
                    <fieldset className="twr-question-item" key={questionIndex}>
                      <legend>Question {questionIndex + 1}</legend>
                      <label>
                        Question
                        <textarea
                          required
                          maxLength={2000}
                          rows={2}
                          value={question.question}
                          onChange={(event) =>
                            updateQuestion(questionIndex, {
                              question: event.target.value,
                            })
                          }
                          placeholder="Enter your question"
                        />
                      </label>
                      <div className="twr-option-heading">
                        <span>Options</span>
                        <button
                          type="button"
                          className="twr-text-button"
                          onClick={() => addOption(questionIndex)}
                        >
                          + Add option
                        </button>
                      </div>
                      <div className="twr-option-list">
                        {question.options.map((option, optionIndex) => (
                          <label
                            className="twr-option-row"
                            key={optionIndex}
                          >
                            <span>{optionLabel(optionIndex)}.</span>
                            <input
                              required
                              maxLength={500}
                              value={option}
                              onChange={(event) =>
                                updateQuestion(questionIndex, {
                                  options: question.options.map((current, i) =>
                                    i === optionIndex
                                      ? event.target.value
                                      : current,
                                  ),
                                })
                              }
                              placeholder={`Option ${optionLabel(optionIndex)}`}
                            />
                            <button
                              type="button"
                              className="twr-remove-option"
                              aria-label={`Remove option ${optionLabel(optionIndex)}`}
                              disabled={question.options.length <= 2}
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                            >
                              ×
                            </button>
                          </label>
                        ))}
                      </div>
                      <label className="twr-answer">
                        Correct answer
                        <select
                          value={question.answer}
                          onChange={(event) =>
                            updateQuestion(questionIndex, {
                              answer: Number(event.target.value),
                            })
                          }
                        >
                          {question.options.map((option, optionIndex) => (
                            <option key={optionIndex} value={optionIndex}>
                              {optionLabel(optionIndex)} —{" "}
                              {option.trim() || `Option ${optionLabel(optionIndex)}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    </fieldset>
                  ))}
                </div>
                {questionError && (
                  <p className="twr-error" role="alert">
                    {questionError}
                  </p>
                )}
                <div className="twr-question-actions">
                  <button
                    type="button"
                    className="twr-secondary"
                    onClick={addQuestion}
                  >
                    + Add questions
                  </button>
                  <button
                    type="submit"
                    className="twr-primary"
                    disabled={saveQuestions.isPending}
                  >
                    {saveQuestions.isPending ? "Saving..." : "Save questions"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function StudentTile({ student, onOpen }) {
  const videoRef = useRef(null);
  const lastTap = useRef(0);

  useEffect(() => {
    if (videoRef.current && student.stream)
      videoRef.current.srcObject = student.stream;
  }, [student.stream]);

  // Double tap works on touch screens too, not only mouse double click
  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      lastTap.current = 0;
      onOpen();
    } else {
      lastTap.current = now;
    }
  };

  const initials = student.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`twr-tile ${student.online ? "" : "offline"}`}
      role="button"
      tabIndex={0}
      onClick={handleTap}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      aria-label={`${student.name}, ${student.online ? "online" : "offline"}. Double tap to open.`}
    >
      {student.stream ? (
        <video ref={videoRef} autoPlay muted playsInline />
      ) : (
        <span className="twr-avatar">{initials}</span>
      )}
      <span className="twr-name">
        <i className={student.online ? "on" : ""} />
        {student.name}
      </span>
    </div>
  );
}

const css = `
.twr{
  --bg:#eef1f6; --card:#ffffff; --ink:#18202f; --muted:#667085; --line:#dde3ec;
  --accent:#0f766e; --accent-soft:#d9f2ee; --off:#f3f4f6;
  height:100dvh; box-sizing:border-box; padding:20px; overflow:hidden; background:var(--bg); color:var(--ink);
  font-family:"Segoe UI",system-ui,-apple-system,Roboto,sans-serif;
}
.twr *{box-sizing:border-box}
.twr-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 4px 14px}
.twr-title{font-size:1.05rem;font-weight:650}
.twr-sub{display:block;font-size:.8rem;color:var(--muted)}
.twr-back{font-size:.8rem;font-weight:600;color:var(--accent);text-decoration:none}
.twr-error{margin:0;color:#b42318;font-size:.8rem;text-align:center}
.twr-state{display:grid;place-content:center;gap:12px;text-align:center}
.twr-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;height:calc(100vh - 88px);min-height:620px}
.twr-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px}
.twr-card h2{margin:0;font-size:.95rem;font-weight:650}
.twr-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.twr-muted{margin:10px 0 0;font-size:.8rem;color:var(--muted)}
.twr-muted.ok{color:var(--accent)}

.twr-students{display:flex;flex-direction:column;min-height:0}
.twr-count{font-size:.8rem;color:var(--muted)}
.twr-tiles{flex:1;min-height:0;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));grid-auto-rows:120px;gap:12px;align-content:start;padding:2px}
.twr-tile{position:relative;border-radius:14px;background:#0f1724;overflow:hidden;display:grid;place-items:center;cursor:pointer;user-select:none;border:2px solid transparent}
.twr-tile:hover{border-color:var(--accent)}
.twr-tile.offline{opacity:.55}
.twr-tile video{width:100%;height:100%;object-fit:cover}
.twr-avatar{width:48px;height:48px;border-radius:50%;background:#26324a;color:#dbe4f3;display:grid;place-items:center;font-weight:600}
.twr-name{position:absolute;left:8px;bottom:8px;display:flex;align-items:center;gap:6px;background:rgba(15,23,36,.75);color:#fff;font-size:.75rem;padding:3px 9px;border-radius:999px}
.twr-name i{width:7px;height:7px;border-radius:50%;background:#8b95a7}
.twr-name i.on{background:#34d399}
.twr-empty{margin:auto;max-width:36ch;text-align:center;color:var(--muted);line-height:1.6}

.twr-side{display:grid;grid-template-rows:auto 170px auto minmax(0,1fr);gap:16px;min-height:0}
.twr-controls{display:grid;gap:10px}
.twr-controls .twr-muted{margin:0;text-align:center}
.twr-controls button{border-radius:12px;font:inherit;font-weight:600;cursor:pointer;padding:11px}
.twr-control-actions{display:flex;gap:8px}
.twr-control-actions button{flex:1;min-width:0}
.twr-secondary{background:#fff;color:var(--ink);border:1px solid var(--line)}
.twr-secondary:hover{border-color:var(--accent);color:var(--accent)}
.twr-primary{background:var(--accent);color:#fff;border:0;font-size:1.05rem!important;padding:14px!important}
.twr-primary:disabled{background:#c5ccd6;cursor:not-allowed}
.twr-secondary:disabled{opacity:.55;cursor:not-allowed}
.twr-modal-backdrop{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:20px;background:rgba(15,23,36,.58)}
.twr-modal{display:flex;flex-direction:column;width:min(680px,100%);max-height:min(90dvh,900px);overflow:hidden;border-radius:20px;background:#fff;box-shadow:0 24px 80px rgba(15,23,36,.25)}
.twr-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px 22px;border-bottom:1px solid var(--line)}
.twr-modal-head h2{margin:0;font-size:1.1rem}
.twr-modal-head p{margin:5px 0 0;color:var(--muted);font-size:.85rem}
.twr-modal-close{border:0;background:transparent;color:var(--muted);font-size:1.6rem;line-height:1;cursor:pointer}
.twr-question-choices{display:grid;gap:12px;padding:22px}
.twr-question-choice{display:grid;gap:5px;padding:18px;text-align:left;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);font:inherit;cursor:pointer}
.twr-question-choice:hover:not(:disabled){border-color:var(--accent);background:#f7fbfa}
.twr-question-choice span{color:var(--muted);font-size:.85rem}
.twr-question-choice.locked{background:#f8fafc;cursor:not-allowed}
.twr-lock{margin-left:8px;padding:3px 7px;border-radius:999px;background:#e8edf3;color:#667085;font-size:.68rem;text-transform:uppercase}
.twr-question-form{display:flex;flex-direction:column;min-height:0}
.twr-question-list{overflow:auto;padding:18px 22px}
.twr-question-item{display:grid;gap:12px;margin:0 0 16px;padding:16px;border:1px solid var(--line);border-radius:14px}
.twr-question-item legend{padding:0 6px;font-weight:700}
.twr-question-item label,.twr-answer{display:grid;gap:6px;color:#344054;font-size:.82rem;font-weight:650}
.twr-question-item textarea,.twr-question-item input,.twr-question-item select{width:100%;min-width:0;border:1px solid var(--line);border-radius:9px;padding:9px 10px;background:#fff;color:var(--ink);font:inherit;font-weight:400}
.twr-question-item textarea{resize:vertical}
.twr-option-heading{display:flex;align-items:center;justify-content:space-between;font-size:.82rem;font-weight:650}
.twr-text-button{border:0;background:transparent;color:var(--accent);font:inherit;font-weight:650;cursor:pointer}
.twr-option-list{display:grid;gap:8px}
.twr-option-row{display:flex!important;align-items:center;gap:8px}
.twr-option-row>span{width:22px;color:var(--muted);text-align:center}
.twr-option-row input{flex:1}
.twr-remove-option{width:32px;height:32px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--muted);font-size:1.1rem;cursor:pointer}
.twr-remove-option:disabled{opacity:.4;cursor:not-allowed}
.twr-question-actions{display:flex;justify-content:space-between;gap:10px;padding:14px 22px;border-top:1px solid var(--line)}
.twr-question-actions button{border-radius:10px;font:inherit;font-weight:650;cursor:pointer;padding:10px 14px}

.twr-self{padding:0;position:relative;overflow:hidden;background:#0f1724}
.twr-self video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
.twr-cam-off{height:100%;display:grid;place-items:center;padding:20px;text-align:center;font-size:.85rem;color:#b8c2d3}
.twr-tag{position:absolute;left:12px;bottom:12px;background:rgba(15,23,36,.72);color:#fff;font-size:.78rem;padding:3px 10px;border-radius:999px}

.twr-notice form{display:grid;gap:8px;margin-top:10px}
.twr-notice textarea{resize:none;border:1px solid var(--line);border-radius:10px;padding:9px 12px;font:inherit;font-size:.9rem}
.twr-notice button,.twr-chat form button{border:0;border-radius:10px;padding:9px 16px;background:var(--accent);color:#fff;font:inherit;font-weight:600;cursor:pointer}
.twr-notice button:disabled,.twr-chat form button:disabled{background:#c5ccd6;cursor:not-allowed}

.twr-chat{display:flex;flex-direction:column;min-height:0}
.twr-chat.is-off{background:var(--off)}
.twr-msgs{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px}
.twr-msg-row{display:flex;align-items:flex-end;align-self:flex-start;gap:7px;max-width:100%}
.twr-msg-row.me{align-self:flex-end;flex-direction:row-reverse}
.twr-msg-avatar{display:grid;place-items:center;position:relative;flex:0 0 32px;width:32px;height:32px;overflow:hidden;border:1px solid var(--line);border-radius:50%;background:#e7edf4;color:#344054;cursor:default}
.twr-msg-avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.twr-msg-avatar-fallback{width:100%;height:100%;place-items:center;padding:2px;font-size:8px;font-weight:700;line-height:1;text-align:center;overflow:hidden;overflow-wrap:anywhere}
.twr-msg{max-width:calc(100% - 39px);background:#eef1f6;padding:7px 11px;border-radius:12px 12px 12px 4px;font-size:.88rem;line-height:1.4;overflow-wrap:anywhere}
.twr-msg-row.me .twr-msg{background:var(--accent);color:#fff;border-radius:12px 12px 4px 12px}
.twr-chat form{display:flex;gap:8px;margin-top:10px}
.twr-chat input[type=text],.twr-chat form input{flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;padding:9px 12px;font:inherit;font-size:.9rem;background:#fff}
.twr-chat form input:disabled{background:transparent;cursor:not-allowed}

.twr-switch{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:.8rem;color:var(--muted)}
.twr-switch input{position:absolute;opacity:0;width:0;height:0}
.twr-track{width:36px;height:20px;border-radius:999px;background:#c5ccd6;position:relative;transition:background .15s}
.twr-track::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}
.twr-switch input:checked + .twr-track{background:var(--accent)}
.twr-switch input:checked + .twr-track::after{transform:translateX(16px)}
.twr-switch input:focus-visible + .twr-track{outline:2px solid var(--accent);outline-offset:2px}
.twr :focus-visible{outline:2px solid var(--accent);outline-offset:2px}

@media (max-width:900px){
  .twr{height:auto;min-height:100dvh;overflow:visible}
  .twr-grid{grid-template-columns:1fr;height:auto}
  .twr-students{min-height:360px}
  .twr-side{grid-template-rows:auto}
  .twr-self{height:220px}
  .twr-chat{min-height:320px}
}
@media (prefers-reduced-motion:reduce){
  .twr-track,.twr-track::after{transition:none}
}
`;
