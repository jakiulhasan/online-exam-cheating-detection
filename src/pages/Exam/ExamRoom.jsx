import React, { useState, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";

const ExamRoom = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("MCQ");
  const [joinCode, setJoinCode] = useState("");

  const createRoom = () => {
    const code = Math.random().toString(36).slice(2, 10).toUpperCase();
    const newRoom = {
      id: code,
      title: title || `Exam - ${code}`,
      type,
      teacher: user?.email,
      students: [],
      messages: [],
      notice: "",
      questions: [],
    };
    setRooms((r) => [newRoom, ...r]);
    setTitle("");
  };

  const joinRoom = (code) => {
    const idx = rooms.findIndex((r) => r.id === code);
    if (idx === -1) return alert("Room not found");
    const room = rooms[idx];
    if (!room.students.includes(user?.email)) {
      room.students.push(user?.email);
      setRooms([...rooms]);
    }
    alert(`Joined room ${code}`);
  };

  const addMessage = (roomId, text) => {
    const idx = rooms.findIndex((r) => r.id === roomId);
    if (idx === -1) return;
    rooms[idx].messages.push({
      from: user?.displayName || user?.email,
      text,
      ts: Date.now(),
    });
    setRooms([...rooms]);
  };

  const setNotice = (roomId, text) => {
    const idx = rooms.findIndex((r) => r.id === roomId);
    if (idx === -1) return;
    rooms[idx].notice = text;
    setRooms([...rooms]);
  };

  const generateQuestions = (roomId) => {
    // Placeholder AI-generated questions stub
    const sample = [
      {
        q: "What is the capital of France?",
        choices: ["Paris", "Rome", "Berlin", "Madrid"],
        answer: 0,
      },
      { q: "2+2=?", choices: ["3", "4", "5", "22"], answer: 1 },
    ];
    const idx = rooms.findIndex((r) => r.id === roomId);
    if (idx === -1) return;
    rooms[idx].questions = sample;
    setRooms([...rooms]);
    alert("Questions generated (stub)");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exam Rooms</h2>

      <div className="card p-4 mb-6">
        <h3 className="font-bold">Create Room (Teacher)</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Room title"
          className="input input-bordered w-full my-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="select select-bordered w-full mb-2"
        >
          <option>MCQ</option>
          <option>Written</option>
        </select>
        <button onClick={createRoom} className="btn btn-secondary">
          Create Room
        </button>
      </div>

      <div className="card p-4 mb-6">
        <h3 className="font-bold">Join Room (Student)</h3>
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="Enter room code"
          className="input input-bordered w-full my-2"
        />
        <button onClick={() => joinRoom(joinCode)} className="btn btn-primary">
          Join
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{r.title}</div>
                <div className="text-xs opacity-60">
                  Code: {r.id} • Type: {r.type}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs">Teacher: {r.teacher}</div>
                <div className="text-xs">Students: {r.students.length}</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="font-semibold">Notice Board</div>
              <div className="p-3 bg-base-200 my-2 rounded">
                {r.notice || "(no notices)"}
              </div>
              <textarea
                placeholder="Set notice"
                className="textarea textarea-bordered w-full mb-2"
                onBlur={(e) => setNotice(r.id, e.target.value)}
              />

              <div className="font-semibold mt-3">Live Chat</div>
              <div className="h-40 overflow-auto p-2 bg-base-200 rounded mb-2">
                {r.messages.map((m, i) => (
                  <div key={i} className="text-sm">
                    <strong>{m.from}:</strong> {m.text}
                  </div>
                ))}
              </div>
              <ChatInput onSend={(t) => addMessage(r.id, t)} />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => generateQuestions(r.id)}
                  className="btn btn-outline"
                >
                  Generate Questions (AI)
                </button>
                <button
                  onClick={() => alert(JSON.stringify(r.questions || []))}
                  className="btn btn-ghost"
                >
                  View Questions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");
  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="input input-bordered flex-1"
        placeholder="Message"
      />
      <button
        onClick={() => {
          if (text.trim()) {
            onSend(text);
            setText("");
          }
        }}
        className="btn"
      >
        Send
      </button>
    </div>
  );
};

export default ExamRoom;
