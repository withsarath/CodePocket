interface EmptyStateProps {
  /** True if the user has any snippets saved at all, false if database is empty */
  hasSnippets: boolean;
  /** Current text in the search input */
  searchQuery: string;
}

/**
 * EmptyState Component
 *
 * Displays a friendly placeholder message when no snippets are visible.
 * Handles two scenarios:
 * 1. The user has snippets, but none matched the search/filter criteria.
 * 2. The user has completely empty storage and needs to create their first snippet.
 */
export const EmptyState = ({ hasSnippets, searchQuery }: EmptyStateProps) => {
  // Case 1: Snippets exist, but current search/filter returned 0 results
  if (hasSnippets) {
    return (
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">
          {/* Search magnifying glass with minus sign */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M8 11h6" />
          </svg>
        </div>
        <h3 className="empty-title">No matches found</h3>
        <p className="empty-description">
          {searchQuery
            ? `No snippets match "${searchQuery}". Try adjusting your search or filters.`
            : 'No snippets match the selected filters. Try choosing different tags.'}
        </p>
      </div>
    );
  }

  // Case 2: No snippets saved at all in the vault
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        {/* Document bookmark icon */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m16 18 2 2 4-4" />
          <path d="M21 15.171A2 2 0 0 0 19.5 12H17a2 2 0 0 1-2-2V7.5A2 2 0 0 0 13.829 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6" />
        </svg>
      </div>
      <h3 className="empty-title">Your pocket is empty</h3>
      <p className="empty-description">
        Click &quot;+ New Snippet&quot; to save your first code snippet.
      </p>
    </div>
  );
};

