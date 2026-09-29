import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

/**
 * StudentWaitingRoom
 * Student side of the online exam: waiting screen + self view + teacher notices + chat.
 *
 * Props (all optional, demo defaults included):
 *  - examTitle, teacherName
 *  - notices:      [{ id, text, time }]   (teacher -> student, read only)
 *  - messages:     [{ id, from, text }]
 *  - chatEnabled:  boolean                (teacher can turn on/off)
 *  - examStarted:  boolean                (teacher clicks start)
 *  - onSendMessage(text)                  (hook your WebSocket here)
 *  - onExamStart()                        (called when examStarted becomes true)
 */
export default function StudentWaitingRoom({
  examTitle: providedExamTitle,
  teacherName: providedTeacherName,
  notices: providedNotices,
  messages: providedMessages,
  chatEnabled: providedChatEnabled,
  examStarted: providedExamStarted,
  onSendMessage,
  onExamStart,
}) {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  const seenNotices = useRef(providedNotices?.length ?? 0);
  const [camError, setCamError] = useState(false);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(0);
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room-detail", roomId],
    enabled: !!user?.email && !!roomId,
    queryFn: async () =>
      (await axiosSecure.get(`/rooms/${encodeURIComponent(roomId)}`)).data,
    refetchInterval: 1500,
    refetchIntervalInBackground: true,
  });
  const sendChat = useMutation({
    mutationFn: (text) =>
      axiosSecure.post(`/rooms/${roomId}/chat`, { message: text }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["room-detail", roomId] }),
  });
  const liveNotices = (room?.notices || []).map((notice) => ({
    id: notice.id,
    text: notice.text,
    time: notice.createdAt
      ? new Date(notice.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
  }));
  const liveMessages = (room?.chat || []).map((message) => ({
    id: message.id,
    from:
      message.senderEmail?.toLowerCase() === user?.email?.toLowerCase()
        ? "me"
        : message.senderRole,
    name:
      message.senderName ||
      (message.senderEmail === user?.email
        ? user?.displayName || user?.email?.split("@")[0]
        : message.senderEmail?.split("@")[0]) ||
      (message.senderRole === "teacher"
        ? room?.teacherEmail?.split("@")[0]
        : "Student"),
    photoURL:
      message.senderPhotoURL ||
      (message.senderEmail?.toLowerCase() === user?.email?.toLowerCase()
        ? user?.photoURL
        : null),
    text: message.text,
  }));
  const notices = providedNotices ?? liveNotices;
  const messages = providedMessages ?? liveMessages;
  const chatEnabled = providedChatEnabled ?? room?.chatEnabled !== false;
  const examStarted = providedExamStarted ?? room?.status === "in-progress";
  const examTitle = providedExamTitle ?? room?.title ?? "Exam room";
  const teacherName =
    providedTeacherName ?? room?.teacherEmail?.split("@")[0] ?? "Your teacher";

  // Self view (webcam)
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

  // New teacher notice -> show alert badge
  useEffect(() => {
    if (notices.length > seenNotices.current) {
      setUnread((n) => n + notices.length - seenNotices.current);
    }
    seenNotices.current = notices.length;
  }, [notices]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.chat]);

  useEffect(() => {
    if (!examStarted) return;
    if (onExamStart) onExamStart();
    else navigate(`/exam/${roomId}/take`, { replace: true });
  }, [examStarted, navigate, onExamStart, roomId]);

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !chatEnabled) return;
    if (onSendMessage) onSendMessage(text);
    else sendChat.mutate(text);
    setDraft("");
  };

  if (isLoading) {
    return (
      <main className="swr swr-state">
        <style>{css}</style>
        <p>Connecting to your exam room...</p>
      </main>
    );
  }

  if (isError || !room) {
    return (
      <main className="swr swr-state">
        <style>{css}</style>
        <p>Room unavailable. Join with a valid room code first.</p>
      </main>
    );
  }

  return (
    <div className="swr">
      <style>{css}</style>

      <header className="swr-head">
        <span className="swr-title">{examTitle}</span>
        <span className="swr-sub">Student side</span>
      </header>

      <div className="swr-grid">
        {/* Waiting card */}
        <section className="swr-card swr-wait" aria-live="polite">
          <div className="swr-pulse" aria-hidden="true" />
          <h1>{examStarted ? "Exam is starting…" : "Please wait"}</h1>
          <p>
            {examStarted
              ? "Loading your questions."
              : `${teacherName} hasn't started the exam yet. This page will open the exam automatically when they do.`}
          </p>
          <p className="swr-hint">Exam starts soon</p>
        </section>

        <aside className="swr-side">
          {/* Self view */}
          <section className="swr-card swr-self">
            {camError ? (
              <div className="swr-cam-off">
                Camera unavailable. Allow camera access in your browser.
              </div>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline />
            )}
            <span className="swr-tag">You</span>
          </section>

          {/* Teacher notice */}
          <section className="swr-card swr-notice">
            {unread > 0 && (
              <span
                className="swr-notice-alert"
                role="status"
                aria-label={`${unread} new teacher notice${unread === 1 ? "" : "s"}`}
                title={`${unread} new teacher notice${unread === 1 ? "" : "s"}`}
              />
            )}
            <div className="swr-card-head">
              <h2>Teacher notices</h2>
              {unread > 0 && (
                <button
                  className="swr-alert"
                  onClick={() => setUnread(0)}
                  aria-label="Mark notices as read"
                >
                  <span className="swr-alert-dot" /> {unread} new
                </button>
              )}
            </div>
            <ul>
              {notices.map((n) => (
                <li key={n.id}>
                  <span>{n.text}</span>
                  <time>{n.time}</time>
                </li>
              ))}
            </ul>
            <p className="swr-muted">Only your teacher can post here.</p>
          </section>

          {/* Chat */}
          <section
            className={`swr-card swr-chat ${chatEnabled ? "" : "is-off"}`}
          >
            <div className="swr-card-head">
              <h2>Chat</h2>
              <span className={`swr-status ${chatEnabled ? "on" : ""}`}>
                {chatEnabled ? "On" : "Off"}
              </span>
            </div>
            <div className="swr-msgs">
              {messages.length === 0 && (
                <p className="swr-muted">
                  {chatEnabled
                    ? "No messages yet."
                    : "Your teacher has turned chat off."}
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
                  m.photoURL || (m.from === "me" ? user?.photoURL : null);

                return (
                  <div
                    key={m.id}
                    className={`swr-msg-row ${m.from === "me" ? "me" : ""}`}
                  >
                    <span
                      className="swr-avatar"
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
                        className="swr-avatar-fallback"
                        style={{ display: photoURL ? "none" : "grid" }}
                      >
                        {name.trim().split(/\s+/)[0] || "?"}
                      </span>
                    </span>
                    <div className="swr-msg">{m.text}</div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={send}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={chatEnabled ? "Type a message" : "Chat is off"}
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
    </div>
  );
}

const css = `
.swr{
  --bg:#eef1f6; --card:#ffffff; --ink:#18202f; --muted:#667085; --line:#dde3ec;
  --accent:#0f766e; --accent-soft:#d9f2ee; --alert:#16a34a; --off:#f3f4f6;
  min-height:100vh; box-sizing:border-box; padding:20px; background:var(--bg); color:var(--ink);
  font-family:"Segoe UI",system-ui,-apple-system,Roboto,sans-serif;
}
.swr-state{display:grid;place-items:center;text-align:center;padding:24px;color:var(--muted)}
.swr *{box-sizing:border-box}
.swr-head{display:flex;align-items:baseline;gap:12px;margin:0 4px 14px}
.swr-title{font-size:1.05rem;font-weight:650}
.swr-sub{font-size:.85rem;color:var(--muted)}
.swr-grid{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:16px;height:calc(100vh - 88px);min-height:560px}
.swr-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px}
.swr-card h2{margin:0;font-size:.95rem;font-weight:650}
.swr-muted{margin:8px 0 0;font-size:.8rem;color:var(--muted)}

.swr-wait{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px}
.swr-wait h1{margin:22px 0 8px;font-size:clamp(1.8rem,3.4vw,2.6rem);font-weight:700;letter-spacing:-.02em}
.swr-wait p{margin:0;max-width:44ch;line-height:1.6;color:var(--muted)}
.swr-wait .swr-hint{margin-top:18px;color:var(--accent);font-weight:600}
.swr-pulse{width:64px;height:64px;border-radius:50%;background:var(--accent-soft);position:relative}
.swr-pulse::after{content:"";position:absolute;inset:20px;border-radius:50%;background:var(--accent)}
.swr-pulse::before{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--accent);animation:swr-ring 2s ease-out infinite}
@keyframes swr-ring{from{transform:scale(.7);opacity:.9}to{transform:scale(1.5);opacity:0}}

.swr-side{display:grid;grid-template-rows:200px auto minmax(0,1fr);gap:16px;min-height:0}
.swr-self{padding:0;position:relative;overflow:hidden;background:#0f1724}
.swr-self video{width:100%;height:100%;object-fit:cover;transform:scaleX(-1)}
.swr-cam-off{height:100%;display:grid;place-items:center;padding:20px;text-align:center;font-size:.85rem;color:#b8c2d3}
.swr-tag{position:absolute;left:12px;bottom:12px;background:rgba(15,23,36,.72);color:#fff;font-size:.78rem;padding:3px 10px;border-radius:999px}

.swr-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.swr-notice{position:relative}
.swr-notice-alert{position:absolute;top:9px;left:9px;width:12px;height:12px;border:2px solid #fff;border-radius:50%;background:#dc2626;box-shadow:0 0 0 1px rgba(220,38,38,.2);animation:swr-alert-pulse 1.2s ease-in-out infinite}
.swr-notice .swr-card-head h2{padding-left:14px}
@keyframes swr-alert-pulse{50%{box-shadow:0 0 0 5px rgba(220,38,38,.16)}}
.swr-notice ul{list-style:none;margin:0;padding:0;display:grid;gap:8px;max-height:110px;overflow:auto}
.swr-notice li{display:flex;justify-content:space-between;gap:12px;font-size:.88rem;line-height:1.45;background:var(--accent-soft);padding:8px 10px;border-radius:10px}
.swr-notice time{color:var(--muted);font-size:.75rem;white-space:nowrap}
.swr-alert{display:inline-flex;align-items:center;gap:6px;border:0;background:var(--alert);color:#fff;font:inherit;font-size:.78rem;font-weight:600;padding:4px 10px;border-radius:999px;cursor:pointer}
.swr-alert-dot{width:7px;height:7px;border-radius:50%;background:#fff;animation:swr-blink 1.2s ease-in-out infinite}
@keyframes swr-blink{50%{opacity:.25}}

.swr-chat{display:flex;flex-direction:column;min-height:0}
.swr-chat.is-off{background:var(--off)}
.swr-status{font-size:.75rem;padding:3px 10px;border-radius:999px;background:#e5e7eb;color:var(--muted)}
.swr-status.on{background:var(--accent-soft);color:var(--accent);font-weight:600}
.swr-msgs{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:6px;padding-right:2px}
.swr-msg-row{display:flex;align-items:flex-end;align-self:flex-start;gap:7px;max-width:100%}
.swr-msg-row.me{align-self:flex-end;flex-direction:row-reverse}
.swr-avatar{display:grid;place-items:center;position:relative;flex:0 0 34px;width:34px;height:34px;overflow:hidden;border:1px solid var(--line);border-radius:50%;background:#e7edf4;color:#344054;cursor:default}
.swr-avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.swr-avatar-fallback{width:100%;height:100%;place-items:center;padding:2px;font-size:8px;font-weight:700;line-height:1;text-align:center;overflow:hidden;overflow-wrap:anywhere}
.swr-msg{max-width:calc(100% - 41px);background:#eef1f6;padding:7px 11px;border-radius:12px 12px 12px 4px;font-size:.88rem;line-height:1.4;overflow-wrap:anywhere}
.swr-msg-row.me .swr-msg{background:var(--accent);color:#fff;border-radius:12px 12px 4px 12px}
.swr-chat form{display:flex;gap:8px;margin-top:10px}
.swr-chat input{flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;padding:9px 12px;font:inherit;font-size:.9rem;background:#fff}
.swr-chat input:disabled{background:transparent;cursor:not-allowed}
.swr-chat button{border:0;border-radius:10px;padding:0 16px;background:var(--accent);color:#fff;font:inherit;font-weight:600;cursor:pointer}
.swr-chat button:disabled{background:#c5ccd6;cursor:not-allowed}
.swr :focus-visible{outline:2px solid var(--accent);outline-offset:2px}

@media (max-width:860px){
  .swr-grid{grid-template-columns:1fr;height:auto}
  .swr-wait{min-height:300px}
  .swr-side{grid-template-rows:auto;}
  .swr-self{height:220px}
  .swr-chat{min-height:320px}
}
@media (prefers-reduced-motion:reduce){
  .swr-pulse::before,.swr-alert-dot,.swr-notice-alert{animation:none}
}
`;
