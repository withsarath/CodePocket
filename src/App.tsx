import { useState, useMemo, useEffect, useRef } from 'react';

import { useLocalStorage } from './hooks/useLocalStorage';
import { initialSnippets } from './data/mockSnippets';
import { exportSnippets, readSnippetsFromFile } from './utils/snippetExportImport';

import { SnippetCard } from './components/SnippetCard';
import { SearchBar } from './components/SearchBar';
import { TagFilter } from './components/TagFilter';
import { AddSnippetModal } from './components/AddSnippetModal';
import { EmptyState } from './components/EmptyState';
import { CodeThemeSelector } from './components/CodeThemeSelector';
import { ThemeToggle, type AppThemeMode } from './components/ThemeToggle';
import { Toast } from './components/Toast';

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

  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // hide the toast after 4.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // apply the app theme to the page and the browser theme color
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

  // all unique tags from every snippet
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    snippets.forEach((snippet) => {
      snippet.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [snippets]);

  // filter by search, tags and favorites
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
    const next = appTheme === 'dark' ? 'light' : 'dark';
    setAppTheme(next);
    if (next === 'light' && codeTheme === 'tokyo-night') setCodeTheme('github-light');
    else if (next === 'dark' && codeTheme === 'github-light') setCodeTheme('tokyo-night');
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

  const handleExportSnippets = () => {
    exportSnippets(snippets);
    setToast({
      type: 'success',
      title: 'Export complete',
      message: `Downloaded ${snippets.length} snippets`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = await readSnippetsFromFile(file);
      setSnippets((prev) => [...imported, ...prev]);
      setToast({
        type: 'success',
        title: 'Import complete',
        message: `Added ${imported.length} snippets`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid file';
      setToast({ type: 'error', title: 'Import failed', message });
    }

    // reset so the same file can be imported again
    event.target.value = '';
  };

  const totalCount = snippets.length;
  const filteredCount = filteredSnippets.length;

  return (
    <div className="app">
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

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
            <p className="app-subtitle">Save and organize your code snippets</p>
          </div>

          <div className="header-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={handleImportFileChange}
            />

            <button
              type="button"
              className="header-secondary-btn"
              onClick={handleImportClick}
              title="Import snippets from a JSON file"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Import</span>
            </button>

            <button
              type="button"
              className="header-secondary-btn"
              onClick={handleExportSnippets}
              title="Export snippets to a JSON file"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export</span>
            </button>

            <CodeThemeSelector currentTheme={codeTheme} onSelectTheme={setCodeTheme} />

            <ThemeToggle mode={appTheme} onToggle={handleToggleAppTheme} />

            <button type="button" className="add-btn" onClick={handleOpenCreateModal}>
              <span className="add-btn-icon">+</span>
              <span className="add-btn-text">New Snippet</span>
            </button>
          </div>
        </header>

        <section className="controls-section">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

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
          <EmptyState hasSnippets={snippets.length > 0} searchQuery={searchQuery} />
        )}
      </main>

      {isModalOpen && (
        <AddSnippetModal
          key={editingSnippet?.id ?? 'new'}
          onClose={handleCloseModal}
          onSave={handleSaveSnippet}
          editingSnippet={editingSnippet}
        />
      )}
    </div>
  );
}