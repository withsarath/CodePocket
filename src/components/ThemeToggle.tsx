export type AppThemeMode = 'dark' | 'light';

interface ThemeToggleProps {
  mode: AppThemeMode;
  onToggle: () => void;
}

export const ThemeToggle = ({ mode, onToggle }: ThemeToggleProps) => {
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      className="theme-mode-toggle"
      onClick={onToggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`mode-toggle-track ${isDark ? 'is-dark' : 'is-light'}`}>
        <span className="mode-toggle-icon-wrap">
          {isDark ? (
            <svg
              className="mode-icon moon-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path d="M19 3v4" />
              <path d="M21 5h-4" />
            </svg>
          ) : (
            <svg
              className="mode-icon sun-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          )}
        </span>
        <span className="mode-label-text">{isDark ? 'Dark' : 'Light'}</span>
      </div>
    </button>
  );
};
