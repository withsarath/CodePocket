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
  const isAllActive = selectedTags.length === 0;

  return (
    <div className="tag-filter-bar">
      <div className="tag-filter-scroll">
        <button
          type="button"
          className={`tag-pill tag-pill-all ${isAllActive ? 'active' : ''}`}
          onClick={onClearTags}
        >
          All
        </button>

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

      <button
        type="button"
        className={`fav-filter-btn ${showFavoritesOnly ? 'active' : ''}`}
        onClick={onToggleFavorites}
        title="Filter favorites"
      >
        <span className="fav-icon">{showFavoritesOnly ? '★' : '☆'}</span>
        <span className="fav-label">Favorites</span>
      </button>
    </div>
  );
};
