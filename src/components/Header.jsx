
export default function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="topbar">
      <a className="brand" href="#home">
        <span>🌷</span>
        habit<span className="brand-accent">bloom</span>
      </a>

      <div className="top-actions">
        <span className="date-pill">
          ✨ {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>

        <button
          className="theme-button"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
