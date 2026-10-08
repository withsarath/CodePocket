interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

export const TagFilter = ({
  allTags,
  selectedTags,
  onToggleTag,
  onClearTags,
  showFavoritesOnly,
  onToggleFavorites,
}: TagFilterProps) => {
  return (
    <div className="tag-filter-bar">
      <div className="tag-filter-scroll">
        <button
          className={`tag-pill tag-pill-all ${selectedTags.length === 0 ? 'active' : ''}`}
          onClick={onClearTags}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <button
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
