
import { useState } from "react";
import { dateKey } from "../App";

function getStreak(habit) {
  const dateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const shiftDate = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  let date = new Date();
  let streak = 0;

  if (!habit.completed[dateKey(date)]) {
    date = shiftDate(date, -1);
  }

  while (habit.completed[dateKey(date)]) {
    streak++;
    date = shiftDate(date, -1);
  }

  return streak;
}

export default function HabitList({
  habits,
  selectedDate,
  onToggle,
  onEdit,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  function startEditing(habit) {
    setEditingId(habit.id);
    setEditName(habit.name);
  }

  function saveEdit(id) {
    const name = editName.trim();
    if (!name) return;

    onEdit(id, name);
    setEditingId(null);
  }

  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <span>🌱</span>
        <h3>Your garden is waiting!</h3>
        <p>Add your first habit and start growing.</p>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habits.map((habit, index) => {
        const done = Boolean(habit.completed[selectedDate]);
        const colors = ["pink", "purple", "blue", "yellow", "green"];

        return (
          <article
            key={habit.id}
            className={`habit-row ${done ? "is-done" : ""}`}
            style={{ "--habit-index": index }}
          >
            <span className={`habit-emoji ${colors[index % colors.length]}`}>
              {habit.emoji}
            </span>

            <div className="habit-info">
              {editingId === habit.id ? (
                <form
                  className="edit-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    saveEdit(habit.id);
                  }}
                >
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    maxLength={50}
                    autoFocus
                    aria-label="Edit habit name"
                  />
                  <button type="submit" aria-label="Save name">✓</button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel editing"
                  >
                    ×
                  </button>
                </form>
              ) : (
                <>
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-streak">
                    🔥 {getStreak(habit)} day streak
                  </span>
                </>
              )}
            </div>

            <label className="habit-checkbox" title="Mark as complete">
              <input
                type="checkbox"
                checked={done}
                onChange={() => onToggle(habit.id)}
                aria-label={`Mark ${habit.name} complete`}
              />
              <span className="checkmark">✓</span>
            </label>

            <div className="habit-actions">
              <button
                className="icon-button"
                onClick={() => startEditing(habit)}
                title="Rename habit"
                aria-label={`Rename ${habit.name}`}
              >
                ✎
              </button>
              <button
                className="icon-button delete-button"
                onClick={() => {
                  if (window.confirm(`Delete "${habit.name}" and its history?`)) {
                    onDelete(habit.id);
                  }
                }}
                title="Delete habit"
                aria-label={`Delete ${habit.name}`}
              >
                ×
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
