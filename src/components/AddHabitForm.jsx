
import { useState } from "react";

const emojis = [
  "✨", "💧", "🏃‍♀️", "📚", "💻", "🧘‍♀️",
  "🥗", "🌞", "🎨", "💤", "📝", "🌿",
];

export default function AddHabitForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✨");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    onAdd(trimmedName, emoji);
    setName("");
    setEmoji("✨");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <span>🌱</span>
        <div>
          <h3>Plant a new habit</h3>
          <p>Small routines make beautiful changes.</p>
        </div>
      </div>

      <label htmlFor="habit-name">What would you like to do?</label>
      <input
        id="habit-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="e.g. Go for a walk"
        maxLength={50}
        autoFocus
        required
      />

      <label htmlFor="habit-emoji">Pick an emoji</label>
      <select
        id="habit-emoji"
        value={emoji}
        onChange={(event) => setEmoji(event.target.value)}
      >
        {emojis.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          Add to my garden ✨
        </button>
        <button className="secondary-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
