import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bell,
  CircleDot,
  MessageCircle,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import WebcamMonitor from "../../components/exam/WebcamMonitor";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const StudentLiveExam = () => {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
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
  const sendMessage = useMutation({
    mutationFn: (text) =>
      axiosSecure.post(`/rooms/${roomId}/chat`, { message: text }),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["room-detail", roomId] });
    },
  });

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f2f5f8] text-sm font-semibold text-slate-500">
        Connecting to the exam room...
      </main>
    );
  }

  if (isError || !room) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f2f5f8] p-5">
        <section className="max-w-md rounded-xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <h1 className="text-xl font-black text-slate-900">
            Room unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Join this exam with its room code before entering the live room.
          </p>
          <Link
            to="/student/exams/join"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Join exam
          </Link>
        </section>
      </main>
    );
  }

  if (room.status === "in-progress" || room.status === "live") {
    return <Navigate to={`/exam/${roomId}/take`} replace />;
  }

  const chatEnabled = room.chatEnabled !== false;
  const latestNotice = room.notices?.at(-1);
  const studentCount = room.students?.length || 0;

  return (
    <main className="min-h-screen bg-[#f2f5f8] px-3 py-4 text-slate-900 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/student/exams/join"
              aria-label="Back to Join exam"
              title="Back to Join exam"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Student live room
              </p>
              <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">
                {room.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
            <CircleDot className="h-3.5 w-3.5 animate-pulse" /> Waiting for
            teacher
          </div>
        </header>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <span>
            {room.subject} <span className="px-1.5 text-slate-300">/</span>
            Room{" "}
            <span className="font-mono font-bold text-slate-700">
              {room.code}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {studentCount} student
            {studentCount === 1 ? "" : "s"} in the room
          </span>
        </div>

        <div className="grid items-stretch gap-4 lg:min-h-[calc(100vh-150px)] lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
          <section className="relative grid min-h-[420px] place-items-center overflow-hidden rounded-xl border border-slate-300 bg-white px-6 py-12 shadow-sm lg:min-h-[calc(100vh-150px)]">
            <div className="max-w-xl text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-7 w-7" />
              </span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {room.subject} · {room.durationMinutes} minutes
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                Please wait here
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                Your teacher has not started the exam yet. Stay in this room;
                the exam will open automatically when it begins.
              </p>
              <p className="mt-6 text-sm font-bold text-emerald-700">
                Exam starts soon
              </p>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-400">
              <span>Signed in as {user?.email}</span>
              <span>Waiting for teacher to start</span>
            </div>
          </section>

          <aside className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <WebcamMonitor active title="Student self view" />

            <section className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                <Bell className="h-4 w-4 text-emerald-700" />
                <h2 className="text-sm font-black text-slate-900">
                  Teacher notice
                </h2>
                {latestNotice && (
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-800">
                    Alert
                  </span>
                )}
              </div>
              <div className="min-h-24 p-4 text-sm leading-6 text-slate-700">
                {latestNotice?.text || "No notice from your teacher yet."}
              </div>
            </section>

            <section className="flex min-h-64 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <MessageCircle className="h-4 w-4 text-slate-500" /> Chatbox
                </h2>
                <span
                  className={`text-[10px] font-black uppercase ${chatEnabled ? "text-emerald-700" : "text-slate-400"}`}
                >
                  {chatEnabled ? "Open" : "Off"}
                </span>
              </div>
              <div className="max-h-56 flex-1 space-y-2 overflow-y-auto p-3">
                {(room.chat || []).map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg px-3 py-2 text-xs ${item.senderRole === "teacher" ? "bg-emerald-50 text-emerald-900" : "bg-slate-50 text-slate-700"}`}
                  >
                    <p className="mb-1 text-[10px] font-black uppercase text-slate-400">
                      {item.senderRole}
                    </p>
                    {item.text}
                  </div>
                ))}
                {!(room.chat || []).length && (
                  <p className="py-8 text-center text-xs text-slate-400">
                    {chatEnabled
                      ? "No messages yet."
                      : "Chat is turned off by your teacher."}
                  </p>
                )}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (message.trim()) sendMessage.mutate(message.trim());
                }}
                className="flex gap-2 border-t border-slate-100 p-3"
              >
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={!chatEnabled || sendMessage.isPending}
                  placeholder={
                    chatEnabled ? "Message your teacher..." : "Chat is off"
                  }
                  aria-label="Chat message"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-emerald-500 disabled:bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={
                    !chatEnabled || !message.trim() || sendMessage.isPending
                  }
                  aria-label="Send message"
                  title="Send message"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 text-white disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              {sendMessage.isError && (
                <p
                  role="alert"
                  className="px-3 pb-3 text-xs font-semibold text-red-700"
                >
                  {sendMessage.error.response?.data?.error ||
                    "Message could not be sent."}
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default StudentLiveExam;
