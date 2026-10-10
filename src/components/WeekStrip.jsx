
import { dateKey } from "../App";

function shiftDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default function WeekStrip({
  selectedDate,
  onSelectDate,
  habits,
}) {
  const today = dateKey();

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(new Date(), index - 6);
    const key = dateKey(date);

    const completed = habits.filter(
      (habit) => habit.completed[key]
    ).length;

    return {
      key,
      date: date.getDate(),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      completed,
      isToday: key === today,
    };
  });

  return (
    <div className="week-strip">
      {days.map((day) => (
        <button
          key={day.key}
          className={`day-button ${
            selectedDate === day.key ? "selected" : ""
          }`}
          onClick={() => onSelectDate(day.key)}
          aria-pressed={selectedDate === day.key}
          aria-label={`${day.label} ${day.date}, ${day.completed} habits completed`}
        >
          <span>{day.label}</span>
          <strong>{day.date}</strong>

          <span
            className={`day-indicator ${
              day.completed > 0 ? "has-progress" : ""
            }`}
          >
            {day.completed > 0 ? "✓" : "·"}
          </span>

          {day.isToday && <small>Today</small>}
        </button>
      ))}
    </div>
  );
}
