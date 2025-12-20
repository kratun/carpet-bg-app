import styles from "./ModalHeader.module.css";

export type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className={styles.container}>
      <p>{title}</p>
      <button
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  );
}
