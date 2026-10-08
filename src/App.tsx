import { useState, useMemo, useEffect } from 'react';
import { initialSnippets } from './data/mockSnippets';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SnippetCard } from './components/SnippetCard';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';
import { AddSnippetModal } from './components/AddSnippetModal';
import { EmptyState } from './components/EmptyState';
import { CodeThemeSelector } from './components/CodeThemeSelector';
import { ThemeToggle, type AppThemeMode } from './components/ThemeToggle';
import type { CodeThemeId } from './types/themes';
import type { Snippet } from './types';

export default function App() {
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('codepocket-snippets', initialSnippets);
  const [appTheme, setAppTheme] = useLocalStorage<AppThemeMode>('codepocket-app-theme', 'dark');
  const [codeTheme, setCodeTheme] = useLocalStorage<CodeThemeId>('codepocket-code-theme', 'tokyo-night');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync data-theme attribute on documentElement and update meta theme-color
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', appTheme === 'light' ? '#f8fafc' : '#000000');
    }
  }, [appTheme]);

  const handleToggleAppTheme = () => {
    setAppTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      // Automatically pair default code themes for best contrast
      if (next === 'light' && codeTheme === 'tokyo-night') {
        setCodeTheme('github-light');
      } else if (next === 'dark' && codeTheme === 'github-light') {
        setCodeTheme('tokyo-night');
      }
      return next;
    });
  };

  // Extract all unique tags from every snippet
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    snippets.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [snippets]);

  // Filter snippets based on search, tags, and favorites
  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tag filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => snippet.tags.includes(tag));

      // Favorites filter
      const matchesFav = !showFavoritesOnly || snippet.isFavorite;

      return matchesSearch && matchesTags && matchesFav;
    });
  }, [snippets, searchQuery, selectedTags, showFavoritesOnly]);

  const handleToggleFavorite = (id: string) => {
    setSnippets((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setSnippets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSnippet = (snippet: Snippet) => {
    setSnippets((prev) => [snippet, ...prev]);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const snippetCount = filteredSnippets.length;
  const totalCount = snippets.length;

  return (
    <div className="app">
      {/* Ambient background glow */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      <main className="main-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <div className="logo-group">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <CodeThemeSelector
              currentTheme={codeTheme}
              onSelectTheme={setCodeTheme}
            />
            <ThemeToggle
              mode={appTheme}
              onToggle={handleToggleAppTheme}
            />
            <button
              className="add-btn"
              onClick={() => setIsModalOpen(true)}
              id="add-snippet-btn"
            >
              <span className="add-btn-icon">+</span>
              <span className="add-btn-text">New Snippet</span>
            </button>
          </div>
        </header>

        {/* Search & Filters */}
        <section className="controls-section">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={handleToggleTag}
            onClearTags={() => setSelectedTags([])}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly((p) => !p)}
          />
          <div className="results-count">
            {snippetCount === totalCount
              ? `${totalCount} snippet${totalCount !== 1 ? 's' : ''}`
              : `${snippetCount} of ${totalCount} snippet${totalCount !== 1 ? 's' : ''}`}
          </div>
        </section>

        {/* Snippet Grid */}
        {filteredSnippets.length > 0 ? (
          <div className="snippet-grid">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                codeTheme={codeTheme}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
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

      {/* Add Modal */}
      <AddSnippetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSnippet}
      />
    </div>
  );
}