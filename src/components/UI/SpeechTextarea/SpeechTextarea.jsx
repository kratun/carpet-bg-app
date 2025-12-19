import { useRef, useState, useEffect, useCallback } from "react";
import Icon, { ICONS } from "../Icons/Icon.jsx";

export default function SpeechTextarea({
  id,
  label,
  value = "",
  defaultListeningDuration = 30000,
  onChange,
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const shouldStopRef = useRef(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "bg-BG";
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange(value ? value + " " + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      if (!shouldStopRef.current) {
        if (Date.now() - startTimeRef.current < defaultListeningDuration) {
          try {
            recognition.start();
          } catch (err) {
            console.error("Restart error:", err);
          }
        } else {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      clearTimeout(timeoutRef.current);
    };
  }, [onChange, value, defaultListeningDuration]);

  const handleMicClick = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      shouldStopRef.current = true;
      recognitionRef.current.stop();
      setIsListening(false);
      clearTimeout(timeoutRef.current);
    } else {
      try {
        shouldStopRef.current = false;
        startTimeRef.current = Date.now();
        recognitionRef.current.start();
        setIsListening(true);

        timeoutRef.current = setTimeout(() => {
          shouldStopRef.current = true;
          recognitionRef.current.stop();
        }, defaultListeningDuration);
      } catch (e) {
        console.error("Recognition start failed:", e);
      }
    }
  }, [isListening, defaultListeningDuration]);

  return (
    <div style={{ width: "100%", marginTop: 24 }}>
      {/* ✅ Label rendered only if provided */}
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 500,
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative", width: "100%" }}>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Говорете или напишете нещо..."
          style={{
            width: "100%",
            padding: "16px 60px 16px 16px",
            border: "1px solid #2563eb",
            borderRadius: 12,
            fontSize: 16,
            lineHeight: 1.5,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        {isSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            title={
              isListening ? "Кликни, за да спреш" : "Кликни, за да говориш"
            }
            aria-label={isListening ? "Спри записа" : "Започни запис"}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: isListening ? "#dc2626" : "#2563eb",
              border: "none",
              borderRadius: "50%",
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              transition: "background 0.2s ease",
            }}
          >
            <Icon
              size={52}
              name={isListening ? ICONS.microphoneOn : ICONS.microphoneOff}
              color="#fff"
            />
          </button>
        )}
      </div>
    </div>
  );
}
