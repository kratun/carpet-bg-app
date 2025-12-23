import { dateUtil } from "../../../utils";
import styles from "./DateNavigator.module.css";

export default function DatePickerControl({ selectedDate, onChange }) {
  const today = dateUtil.getCurrentDateFormatted("YYYY-MM-DD");

  const handleDateChange = (e) => {
    onChange(e.target.value);
  };

  const incrementDay = () => {
    onChange(dateUtil.incrementDay(selectedDate, 1));
  };

  const decrementDay = () => {
    const newDate = dateUtil.decrementDay(selectedDate, 1);
    if (newDate.isBefore(today, "day")) {
      return;
    }

    onChange(newDate.format("YYYY-MM-DD"));
  };

  return (
    <div className={styles.dateControls}>
      <button
        onClick={decrementDay}
        disabled={!dateUtil.isAfter(selectedDate, today)}
      >
        ← Предишен ден
      </button>

      <input
        type="date"
        min={dateUtil.format(today, "YYYY-MM-DD")}
        value={selectedDate}
        onChange={handleDateChange}
        className={styles.dateInput}
      />

      <button onClick={incrementDay}>Следващ ден →</button>
    </div>
  );
}
