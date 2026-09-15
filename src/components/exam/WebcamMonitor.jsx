import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, ScanFace } from "lucide-react";

// WebcamMonitor — live camera preview + slot for future AI proctoring.
//
// Today it only mirrors the student's webcam so they know they're being
// monitored. The commented block in the effect marks exactly where a
// TensorFlow.js / YOLO gaze or face-count model would hook in later:
// grab frames from `videoRef`, run inference, and call `onSignal(...)`
// which routes straight into the useProctoring violation pipeline.
const WebcamMonitor = ({ active = false, onSignal }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | live | denied | unsupported

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unsupported");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("live");

        // ── Future AI hook ──────────────────────────────────────────────
        // const model = await loadGazeOrFaceModel();
        // const loop = async () => {
        //   const result = await model.estimate(videoRef.current);
        //   if (result.faces === 0) onSignal?.("face-absent", "No face detected");
        //   if (result.faces > 1) onSignal?.("multi-face", "Multiple faces detected");
        //   if (result.lookingAway) onSignal?.("gaze-away", "Looking away from screen");
        //   rafRef.current = requestAnimationFrame(loop);
        // };
        // loop();
        // ────────────────────────────────────────────────────────────────
      } catch {
        if (!cancelled) setStatus("denied");
      }
    };

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [active, onSignal]);

  return (
    <div className="card bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-base-200 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold">
          <ScanFace className="w-4 h-4 text-primary" /> Webcam Monitor
        </span>
        {status === "live" ? (
          <span className="badge badge-success badge-sm gap-1 text-white">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live
          </span>
        ) : (
          <span className="badge badge-ghost badge-sm gap-1">
            <CameraOff className="w-3 h-3" /> Off
          </span>
        )}
      </div>

      <div className="relative aspect-video bg-black grid place-items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${
            status === "live" ? "block" : "hidden"
          }`}
        />
        {status !== "live" && (
          <div className="text-center text-xs text-white/60 p-4 flex flex-col items-center gap-2">
            <Camera className="w-6 h-6" />
            {status === "denied" && "Camera access denied"}
            {status === "unsupported" && "Camera not supported"}
            {status === "idle" && "Camera will start with the exam"}
          </div>
        )}
      </div>

      <p className="text-[11px] text-base-content/50 px-4 py-2">
        AI gaze &amp; face detection coming soon — camera feed is local-only.
      </p>
    </div>
  );
};

export default WebcamMonitor;
