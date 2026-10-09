interface SearchBarProps {
  /** The current search query string from parent state */
  value: string;
  /** Callback function called whenever the search query changes */
  onChange: (value: string) => void;
}

/**
 * SearchBar Component
 *
 * This is a "controlled component" in React:
 * - It displays the current `value` passed from the parent (`App.tsx`).
 * - When the user types, `onChange` tells the parent to update its state.
 * - When there is text, a clear "✕" button appears to easily reset the search.
 */
export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="search-bar">
      {/* Search magnifying glass icon */}
      <svg
        className="search-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      {/* Main search text input */}
      <input
        id="search-input"
        type="text"
        placeholder="Search snippets by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />

      {/* Clear button (only shown when user has typed something) */}
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};

