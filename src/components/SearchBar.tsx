interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="search-bar">
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

      <input
        id="search-input"
        type="text"
        placeholder="Search snippets by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />

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
