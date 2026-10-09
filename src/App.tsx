import { useState, useMemo, useEffect } from 'react';

// Custom Hooks & Initial Data
import { useLocalStorage } from './hooks/useLocalStorage';
import { initialSnippets } from './data/mockSnippets';

// UI Components
import { SnippetCard } from './components/SnippetCard';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';
import { AddSnippetModal } from './components/AddSnippetModal';
import { EmptyState } from './components/EmptyState';
import { CodeThemeSelector } from './components/CodeThemeSelector';
import { ThemeToggle, type AppThemeMode } from './components/ThemeToggle';

// Types
import type { Snippet } from './types';
import type { CodeThemeId } from './types/themes';

/**
 * Main Application Component: CodePocket
 *
 * This is the root component that ties all parts of the app together:
 * - Manages snippet storage in localStorage
 * - Manages application dark/light mode and code syntax color themes
 * - Handles real-time search, tag filtering, and favorites filtering
 * - Displays the snippet cards grid and creation modal
 */
export default function App() {
  // -------------------------------------------------------------
  // 1. PERSISTED STATE (Stored in the browser's localStorage)
  // -------------------------------------------------------------
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>(
    'codepocket-snippets',
    initialSnippets
  );

  const [appTheme, setAppTheme] = useLocalStorage<AppThemeMode>(
    'codepocket-app-theme',
    'dark'
  );

  const [codeTheme, setCodeTheme] = useLocalStorage<CodeThemeId>(
    'codepocket-code-theme',
    'tokyo-night'
  );

  // -------------------------------------------------------------
  // 2. TEMPORARY UI STATE (Resets on page reload)
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // -------------------------------------------------------------
  // 3. SIDE EFFECTS
  // -------------------------------------------------------------
  // Update the HTML document's data-theme attribute whenever appTheme changes
  // This allows CSS to switch between dark and light color palettes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);

    // Update browser tab/mobile address bar theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        appTheme === 'light' ? '#f8fafc' : '#000000'
      );
    }
  }, [appTheme]);

  // -------------------------------------------------------------
  // 4. COMPUTED DATA (Calculated automatically when state changes)
  // -------------------------------------------------------------

  // Collect a sorted list of all unique tags across all snippets
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();

    // Add each snippet's tags into a Set (Sets automatically ignore duplicates)
    snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => tagSet.add(tag));
    });

    // Convert Set back to an array and sort alphabetically
    return Array.from(tagSet).sort();
  }, [snippets]);

  // Filter snippets according to search query, selected tags, and favorite filter
  const filteredSnippets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return snippets.filter((snippet) => {
      // Check 1: Search match (title, description, or tags)
      const matchesSearch =
        !query ||
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(query));

      // Check 2: Tag match (must match at least one selected tag if any are selected)
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((selectedTag) => snippet.tags.includes(selectedTag));

      // Check 3: Favorite match (must be favorite if "Favorites" filter is on)
      const matchesFavorite = !showFavoritesOnly || snippet.isFavorite;

      // Keep this snippet only if it passes all three conditions
      return matchesSearch && matchesTags && matchesFavorite;
    });
  }, [snippets, searchQuery, selectedTags, showFavoritesOnly]);

  // -------------------------------------------------------------
  // 5. EVENT HANDLERS
  // -------------------------------------------------------------

  // Switch between Dark mode and Light mode
  const handleToggleAppTheme = () => {
    setAppTheme((previousTheme) => {
      const nextTheme = previousTheme === 'dark' ? 'light' : 'dark';

      // Automatically pair recommended default code themes for best contrast
      if (nextTheme === 'light' && codeTheme === 'tokyo-night') {
        setCodeTheme('github-light');
      } else if (nextTheme === 'dark' && codeTheme === 'github-light') {
        setCodeTheme('tokyo-night');
      }

      return nextTheme;
    });
  };

  // Toggle favorite / starred status for a snippet
  const handleToggleFavorite = (snippetId: string) => {
    setSnippets((previousSnippets) =>
      previousSnippets.map((snippet) => {
        if (snippet.id === snippetId) {
          return { ...snippet, isFavorite: !snippet.isFavorite };
        }
        return snippet;
      })
    );
  };

  // Delete a snippet from the list
  const handleDeleteSnippet = (snippetId: string) => {
    setSnippets((previousSnippets) =>
      previousSnippets.filter((snippet) => snippet.id !== snippetId)
    );
  };

  // Add a newly created snippet to the very top of the list
  const handleAddSnippet = (newSnippet: Snippet) => {
    setSnippets((previousSnippets) => [newSnippet, ...previousSnippets]);
  };

  // Toggle selection of a tag filter (click on selects it, click again unselects it)
  const handleToggleTag = (tag: string) => {
    setSelectedTags((previousTags) =>
      previousTags.includes(tag)
        ? previousTags.filter((t) => t !== tag)
        : [...previousTags, tag]
    );
  };

  // Reset all selected tag filters
  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // Count metrics for display
  const totalCount = snippets.length;
  const filteredCount = filteredSnippets.length;

  return (
    <div className="app">
      {/* Decorative ambient background glows */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      <main className="main-container">
        {/* ================= HEADER SECTION ================= */}
        <header className="app-header">
          <div className="header-left">
            <div className="logo-group">
              <div className="logo-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h1 className="app-title">CodePocket</h1>
            </div>
            <p className="app-subtitle">
              Your personal snippet vault &amp; developer bookmark engine
            </p>
          </div>

          <div className="header-actions">
            {/* Code syntax highlight theme selector */}
            <CodeThemeSelector
              currentTheme={codeTheme}
              onSelectTheme={setCodeTheme}
            />

            {/* Dark / Light mode switch */}
            <ThemeToggle
              mode={appTheme}
              onToggle={handleToggleAppTheme}
            />

            {/* Add snippet button */}
            <button
              id="add-snippet-btn"
              type="button"
              className="add-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="add-btn-icon">+</span>
              <span className="add-btn-text">New Snippet</span>
            </button>
          </div>
        </header>

        {/* ================= CONTROLS SECTION (Search & Filters) ================= */}
        <section className="controls-section">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearTags={handleClearTags}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
          />

          <div className="results-count">
            {filteredCount === totalCount
              ? `${totalCount} snippet${totalCount !== 1 ? 's' : ''}`
              : `${filteredCount} of ${totalCount} snippet${totalCount !== 1 ? 's' : ''}`}
          </div>
        </section>

        {/* ================= SNIPPETS GRID SECTION ================= */}
        {filteredSnippets.length > 0 ? (
          <div className="snippet-grid">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                codeTheme={codeTheme}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteSnippet}
                onSelectTheme={setCodeTheme}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            hasSnippets={snippets.length > 0}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* ================= MODAL DIALOG ================= */}
      <AddSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSnippet}
      />
    </div>
  );
}