
export default function SummaryCards({
  progress,
  completedCount,
  totalHabits,
  bestStreak,
}) {
  return (
    <section className="summary-grid">
      <article className="summary-card progress-card">
        <div className="summary-label">
          <span className="summary-icon">🌱</span>
          Daily progress
        </div>

        <div className="progress-numbers">
          <strong>{progress}%</strong>
          <span>{completedCount} of {totalHabits} habits</span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Daily habit completion"
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="small-note">
          {progress === 100 && totalHabits > 0
            ? "You did it! Time to celebrate 🎉"
            : "Growing at your own pace 💗"}
        </p>
      </article>

      <article className="summary-card">
        <div className="summary-label">
          <span className="summary-icon">🔥</span>
          Best current streak
        </div>
        <div className="progress-numbers">
          <strong>{bestStreak} <span className="unit">days</span></strong>
        </div>
        <p className="small-note">Consistency looks good on you ✨</p>
      </article>

      <article className="summary-card">
        <div className="summary-label">
          <span className="summary-icon">🌸</span>
          Habits in your garden
        </div>
        <div className="progress-numbers">
          <strong>{totalHabits}</strong>
        </div>
        <p className="small-note">Make room for what matters.</p>
      </article>
    </section>
  );
}
