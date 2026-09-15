import { useCallback, useEffect, useRef, useState } from "react";

// useProctoring — client-side exam integrity watchdog.
//
// Detects: tab/window switch (visibilitychange, blur), fullscreen exit,
// right-click, copy/paste/cut, and risky key combos (Ctrl/Cmd+C/V/X/P/U/S,
// F12, DevTools shortcuts). Each detection is recorded as
// { type, detail, ts } and surfaced via the onViolation callback.
//
// Designed as a slot for future webcam/AI detectors: just call record(...)
// from any new source and it flows through the same violation pipeline.
const nowTs = () => Date.now();

const isDocFullscreen = () =>
  !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );

export default function useProctoring({
  active = false,
  maxViolations = 5,
  onViolation,
  onLimitReached,
} = {}) {
  const [violations, setViolations] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep latest callbacks / config in refs so the event listeners always call
  // the freshest closure without needing to re-bind on every render.
  const onViolationRef = useRef(onViolation);
  const onLimitRef = useRef(onLimitReached);
  const maxRef = useRef(maxViolations);
  const countRef = useRef(0);
  const limitFiredRef = useRef(false);

  useEffect(() => {
    onViolationRef.current = onViolation;
  }, [onViolation]);
  useEffect(() => {
    onLimitRef.current = onLimitReached;
  }, [onLimitReached]);
  useEffect(() => {
    maxRef.current = maxViolations;
  }, [maxViolations]);

  // Pure state update; callbacks fire exactly once (safe under StrictMode).
  const record = useCallback((type, detail) => {
    const entry = { type, detail, ts: nowTs() };
    countRef.current += 1;
    const currentCount = countRef.current;

    setViolations((prev) => [...prev, entry]);
    onViolationRef.current?.(entry, currentCount);

    if (!limitFiredRef.current && currentCount >= maxRef.current) {
      limitFiredRef.current = true;
      onLimitRef.current?.(currentCount);
    }
  }, []);

  const requestFullscreen = useCallback(async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch {
      /* user gesture required / denied — ignore */
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (!isDocFullscreen()) return;
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    } catch {
      /* ignore */
    }
  }, []);

  const reset = useCallback(() => {
    countRef.current = 0;
    limitFiredRef.current = false;
    setViolations([]);
  }, []);

  useEffect(() => {
    if (!active) return;

    const handleVisibility = () => {
      if (document.hidden)
        record("tab-hidden", "Left the exam tab or minimized the window");
    };
    const handleBlur = () =>
      record("window-blur", "Exam window lost focus");
    const handleFullscreenChange = () => {
      const fs = isDocFullscreen();
      setIsFullscreen(fs);
      if (!fs) record("fullscreen-exit", "Exited fullscreen mode");
    };
    const handleContextMenu = (e) => {
      e.preventDefault();
      record("context-menu", "Right-click menu blocked");
    };
    const handleCopy = (e) => {
      e.preventDefault();
      record("copy", "Copy action blocked");
    };
    const handlePaste = (e) => {
      e.preventDefault();
      record("paste", "Paste action blocked");
    };
    const handleCut = (e) => {
      e.preventDefault();
      record("cut", "Cut action blocked");
    };
    const handleKeyDown = (e) => {
      const k = (e.key || "").toLowerCase();
      const mod = e.ctrlKey || e.metaKey;

      if (mod && ["c", "v", "x", "p", "u", "s"].includes(k)) {
        e.preventDefault();
        record(
          "key-combo",
          `Blocked shortcut: ${e.metaKey ? "Cmd" : "Ctrl"}+${k.toUpperCase()}`,
        );
        return;
      }
      if (k === "f12") {
        e.preventDefault();
        record("devtools", "F12 / DevTools blocked");
        return;
      }
      if (mod && e.shiftKey && ["i", "j", "c"].includes(k)) {
        e.preventDefault();
        record("devtools", "DevTools shortcut blocked");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);

    setIsFullscreen(isDocFullscreen());

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, record]);

  return {
    violations,
    count: violations.length,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    reset,
    maxViolations,
  };
}
