import { useEffect, useRef, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import Icon, { ICONS } from "../Icons/Icon";
import styles from "./SpeechTextarea.module.css";

export interface SpeechTextareaProps {
  id: string;
  label?: string;
  value: string;
  defaultListeningDuration?: number;
  onChange: (value: string) => void;
}

export default function SpeechTextarea({
  id,
  label,
  value,
  defaultListeningDuration = 30_000,
  onChange,
}: SpeechTextareaProps) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const timeoutRef = useRef<number | null>(null);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * START / STOP microphone
   */
  const handleMicClick = useCallback(() => {
    // STOP
    if (listening) {
      SpeechRecognition.stopListening();

      if (transcript.trim()) {
        onChange(value ? `${value} ${transcript}`.trim() : transcript.trim());
        resetTranscript();
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      return;
    }

    // START
    resetTranscript();
    SpeechRecognition.startListening({
      lang: "bg-BG",
      continuous: true,
    });

    timeoutRef.current = window.setTimeout(() => {
      SpeechRecognition.stopListening();

      if (transcript.trim()) {
        onChange(value ? `${value} ${transcript}`.trim() : transcript.trim());
        resetTranscript();
      }
    }, defaultListeningDuration);
  }, [
    listening,
    transcript,
    value,
    onChange,
    resetTranscript,
    defaultListeningDuration,
  ]);

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.textareaWrapper}>
        <textarea
          id={id}
          name={id}
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Говорете или напишете нещо..."
        />

        {browserSupportsSpeechRecognition && (
          <button
            type="button"
            className={`${styles.micButton} ${
              listening ? styles.micButtonActive : ""
            }`}
            onClick={handleMicClick}
            aria-pressed={listening}
            aria-label={listening ? "Спри записа" : "Започни запис"}
            title={listening ? "Кликни, за да спреш" : "Кликни, за да говориш"}
          >
            <Icon
              size={48}
              name={listening ? ICONS.microphoneOn : ICONS.microphoneOff}
              color="#fff"
            />
          </button>
        )}
      </div>

      {!browserSupportsSpeechRecognition && (
        <p className={styles.unsupported}>
          Браузърът не поддържа гласово разпознаване.
        </p>
      )}
    </div>
  );
}
