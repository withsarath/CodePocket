interface TagFilterProps {
  /** Complete list of unique tags found across all snippets */
  allTags: string[];
  /** List of tags currently selected by the user */
  selectedTags: string[];
  /** Function to toggle a tag on or off */
  onToggleTag: (tag: string) => void;
  /** Function to clear all selected tags and show everything */
  onClearTags: () => void;
  /** Whether the "Favorites" filter is currently active */
  showFavoritesOnly: boolean;
  /** Function to toggle the favorites filter */
  onToggleFavorites: () => void;
}

/**
 * TagFilter Component
 *
 * Provides clickable tag pills to quickly filter snippets by category/technology.
 * Also includes a toggle button to show only starred favorite snippets.
 */
export const TagFilter = ({
  allTags,
  selectedTags,
  onToggleTag,
  onClearTags,
  showFavoritesOnly,
  onToggleFavorites,
}: TagFilterProps) => {
  // If no specific tags are chosen, "All" should be marked active
  const isAllActive = selectedTags.length === 0;

  return (
    <div className="tag-filter-bar">
      {/* Horizontal scrollable row of tag pills */}
      <div className="tag-filter-scroll">
        {/* "All" button resets active tag filters */}
        <button
          type="button"
          className={`tag-pill tag-pill-all ${isAllActive ? 'active' : ''}`}
          onClick={onClearTags}
        >
          All
        </button>

        {/* Dynamic list of all available tags */}
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`tag-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleTag(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Favorites filter button */}
      <button
        type="button"
        className={`fav-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
        onClick={onToggleFavorites}
        aria-label="Filter favorites"
      >
        <span className="fav-icon">{showFavoritesOnly ? '★' : '☆'}</span>
        <span className="fav-label">Favorites</span>
      </button>
    </div>
  );
};

