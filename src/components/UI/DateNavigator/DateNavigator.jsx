import { dateUtil } from "../../../utils";
import styles from "./DateNavigator.module.css";

export default function DatePickerControl({ selectedDate, onChange }) {
  const today = dateUtil.getCurrentDateFormatted("YYYY-MM-DD");

  const handleDateChange = (e) => {
    onChange(e.target.value);
  };

  const incrementDate = () => {
    onChange(dateUtil.incrementDay(selectedDate, 1));
  };

  const decrementDate = () => {
    const newDate = dateUtil.decrementDate(selectedDate, 1);
    if (newDate.isBefore(today, "day")) {
      return;
    }

    onChange(newDate.format("YYYY-MM-DD"));
  };

  return (
    <div className={styles.dateControls}>
      <button
        onClick={decrementDate}
        disabled={!dateUtil.isAfter(selectedDate, today)}
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
