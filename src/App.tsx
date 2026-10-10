import { useState, useMemo, useEffect } from 'react';

import { useLocalStorage } from './hooks/useLocalStorage';
import { initialSnippets } from './data/mockSnippets';

import { SnippetCard } from './components/SnippetCard';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';
import { AddSnippetModal } from './components/AddSnippetModal';
import { EmptyState } from './components/EmptyState';
import { CodeThemeSelector } from './components/CodeThemeSelector';
import { ThemeToggle, type AppThemeMode } from './components/ThemeToggle';

import type { Snippet } from './types';
import type { CodeThemeId } from './types/themes';

export default function App() {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);

  // Apply the app theme to the document and update the browser theme color
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appTheme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        appTheme === 'light' ? '#f8fafc' : '#000000'
      );
    }
  }, [appTheme]);

  // Collect all unique tags from every snippet
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [snippets]);

  // Filter snippets by search, tags, and favorites
  const filteredSnippets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return snippets.filter((snippet) => {
      const matchesSearch =
        !query ||
        snippet.title.toLowerCase().includes(query) ||
        snippet.description.toLowerCase().includes(query) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((selectedTag) => snippet.tags.includes(selectedTag));

      const matchesFavorite = !showFavoritesOnly || snippet.isFavorite;

      return matchesSearch && matchesTags && matchesFavorite;
    });
  }, [snippets, searchQuery, selectedTags, showFavoritesOnly]);

  const handleToggleAppTheme = () => {
    setAppTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';

      // Auto-switch code theme to a good match for the new app theme
      if (next === 'light' && codeTheme === 'tokyo-night') {
        setCodeTheme('github-light');
      } else if (next === 'dark' && codeTheme === 'github-light') {
        setCodeTheme('tokyo-night');
      }

      return next;
    });
  };

  const handleToggleFavorite = (snippetId: string) => {
    setSnippets((prev) =>
      prev.map((snippet) =>
        snippet.id === snippetId
          ? { ...snippet, isFavorite: !snippet.isFavorite }
          : snippet
      )
    );
  };

  const handleDeleteSnippet = (snippetId: string) => {
    setSnippets((prev) => prev.filter((snippet) => snippet.id !== snippetId));
  };

  const handleOpenCreateModal = () => {
    setEditingSnippet(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSnippet(null);
  };

  const handleSaveSnippet = (snippetToSave: Snippet) => {
    setSnippets((prev) => {
      const exists = prev.some((s) => s.id === snippetToSave.id);
      if (exists) {
        return prev.map((s) => (s.id === snippetToSave.id ? snippetToSave : s));
      }
      return [snippetToSave, ...prev];
    });
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  const totalCount = snippets.length;
  const filteredCount = filteredSnippets.length;

  return (
    <div className="app">
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      <main className="main-container">
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
            <CodeThemeSelector
              currentTheme={codeTheme}
              onSelectTheme={setCodeTheme}
            />

            <ThemeToggle
              mode={appTheme}
              onToggle={handleToggleAppTheme}
            />

            <button
              id="add-snippet-btn"
              type="button"
              className="add-btn"
              onClick={handleOpenCreateModal}
            >
              <span className="add-btn-icon">+</span>
              <span className="add-btn-text">New Snippet</span>
            </button>
          </div>
        </header>

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

        {filteredSnippets.length > 0 ? (
          <div className="snippet-grid">
            {filteredSnippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                codeTheme={codeTheme}
                onToggleFavorite={handleToggleFavorite}
                onEdit={handleOpenEditModal}
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

      <AddSnippetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSnippet}
        editingSnippet={editingSnippet}
      />
    </div>
  );
}