
import { useEffect, useState } from "react";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import WeekStrip from "./components/WeekStrip";
import HabitList from "./components/HabitList";
import AddHabitForm from "./components/AddHabitForm";
import Analytics from "./components/Analytics";
import "./App.css";

const STORAGE_KEY = "habit-bloom-data";

const defaultHabits = [
  { id: "water", name: "Drink Water", emoji: "💧", completed: {} },
  { id: "exercise", name: "Exercise", emoji: "🏃‍♀️", completed: {} },
  { id: "reading", name: "Reading", emoji: "📚", completed: {} },
  { id: "coding", name: "Coding", emoji: "💻", completed: {} },
  { id: "meditation", name: "Meditation", emoji: "🧘‍♀️", completed: {} },
];

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function shiftDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateStreak(habit) {
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

function App() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved?.habits)) return saved.habits;
    } catch {
      // Use default habits if saved data is invalid.
    }
    return defaultHabits;
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY))?.darkMode ?? false;
    } catch {
      return false;
    }
  });

  const [selectedDate, setSelectedDate] = useState(dateKey());
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ habits, darkMode })
    );
  }, [habits, darkMode]);

  const completedCount = habits.filter(
    (habit) => habit.completed[selectedDate]
  ).length;

  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;

  function toggleHabit(id) {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: {
                ...habit.completed,
                [selectedDate]: !habit.completed[selectedDate],
              },
            }
          : habit
      )
    );
  }

  function addHabit(name, emoji) {
    setHabits((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        name,
        emoji,
        completed: {},
      },
    ]);
    setShowAddForm(false);
  }

  function editHabit(id, name) {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, name } : habit
      )
    );
  }

  function deleteHabit(id) {
    setHabits((current) => current.filter((habit) => habit.id !== id));
  }

  const bestStreak = habits.length
    ? Math.max(...habits.map(calculateStreak))
    : 0;

  const isToday = selectedDate === dateKey();

  const selectedDateLabel = new Date(
    `${selectedDate}T12:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
      />

      <main className="dashboard">
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR LITTLE SPACE TO GROW ✨</p>
            <h1>Little by little, <span>you bloom.</span></h1>
            <p className="subtitle">
              Progress, not perfection. Let's make today count.
            </p>
          </div>
          <div className="welcome-flower" aria-hidden="true">🌷</div>
        </section>

        <SummaryCards
          progress={progress}
          completedCount={completedCount}
          totalHabits={habits.length}
          bestStreak={bestStreak}
        />

        <section className="panel tracker-panel">
          <div className="tracker-heading">
            <div>
              <p className="eyebrow">YOUR JOURNEY</p>
              <h2>Your habit garden <span>♡</span></h2>
              <p className="muted">
                {isToday ? "Today" : selectedDateLabel}
                {" · "}
                {completedCount === habits.length && habits.length > 0
                  ? "Everything is blooming! 🎉"
                  : "Every little step counts."}
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setShowAddForm((value) => !value)}
            >
              {showAddForm ? "Cancel" : "+ New habit"}
            </button>
          </div>

          <WeekStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            habits={habits}
          />

          {showAddForm && (
            <AddHabitForm
              onAdd={addHabit}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          <div className="list-heading">
            <h3>{isToday ? "Today's rituals" : "Your rituals"}</h3>
            <span>{completedCount}/{habits.length} completed</span>
          </div>

          <HabitList
            habits={habits}
            selectedDate={selectedDate}
            onToggle={toggleHabit}
            onEdit={editHabit}
            onDelete={deleteHabit}
          />

          <div className="encouragement">
            <span>💌</span>
            <p>
              You're building a life you love, one tiny habit at a time.
              Be kind to yourself along the way.
            </p>
          </div>
        </section>
         <Analytics
          habits={habits}
          selectedDate={selectedDate}
        />


        <footer className="app-footer">
          <span>🌷 habitbloom</span>
          <span>Your little progress is saved on this device.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
