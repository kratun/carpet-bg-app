import dayjs from "dayjs";
import styles from "./DateNavigator.module.css";

export default function DatePickerControl({ selectedDate, onChange }) {
  const today = dayjs().startOf("day");

  const handleDateChange = (e) => {
    onChange(e.target.value);
  };

  const incrementDate = () => {
    onChange(dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD"));
  };

  const decrementDate = () => {
    const newDate = dayjs(selectedDate).subtract(1, "day");
    if (newDate.isBefore(today, "day")) {
      return;
    }

    onChange(newDate.format("YYYY-MM-DD"));
  };

  return (
    <div className={styles.dateControls}>
      <button
        onClick={decrementDate}
        disabled={!dayjs(selectedDate, "YYYY-MM-DD").isAfter(today, "day")}
      >
        ← Предишен ден
      </button>

      <input
        type="date"
        min={today.format("YYYY-MM-DD")}
        value={selectedDate}
        onChange={handleDateChange}
        className={styles.dateInput}
      />

      <button onClick={incrementDate}>Следващ ден →</button>
    </div>
  );
}
