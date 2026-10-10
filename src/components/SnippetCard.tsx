import { useState, useMemo } from 'react';
import type { Snippet } from '../types';
import { highlightCode } from '../utils/syntaxHighlighter';
import { copyTextToClipboard } from '../utils/clipboard';
import { CODE_THEMES, type CodeThemeId } from '../types/themes';

interface SnippetCardProps {
  snippet: Snippet;
  codeTheme?: CodeThemeId;
  onToggleFavorite: (id: string) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onSelectTheme?: (theme: CodeThemeId) => void;
}

const LANG_COLORS: Record<string, string> = {
  typescript: '#38bdf8',
  javascript: '#facc15',
  python: '#60a5fa',
  sql: '#2dd4bf',
  bash: '#4ade80',
  css: '#c084fc',
  html: '#fb923c',
  yaml: '#f43f5e',
  rust: '#fb923c',
  go: '#38bdf8',
  java: '#fbbf24',
  csharp: '#34d399',
  ruby: '#f43f5e',
  php: '#a78bfa',
};

export const SnippetCard = ({
  snippet,
  codeTheme = 'tokyo-night',
  onToggleFavorite,
  onEdit,
  onDelete,
  onSelectTheme,
}: SnippetCardProps) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteConfirmKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      handleCancelDelete();
    }
  };

  const handleCopy = async () => {
    const succeeded = await copyTextToClipboard(snippet.code);
    if (succeeded) {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } else {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(snippet.id);
  };

  const handleCycleTheme = () => {
    if (!onSelectTheme) return;
    const currentIndex = CODE_THEMES.findIndex((theme) => theme.id === codeTheme);
    const nextIndex = (currentIndex + 1) % CODE_THEMES.length;
    onSelectTheme(CODE_THEMES[nextIndex].id);
  };

  const currentThemeObj = CODE_THEMES.find((theme) => theme.id === codeTheme) || CODE_THEMES[0];
  const langColor = LANG_COLORS[snippet.language.toLowerCase()] || '#94a3b8';

  const highlightedCode = useMemo(() => {
    return highlightCode(snippet.code, snippet.language);
  }, [snippet.code, snippet.language]);

  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <div className="snippet-header-left">
          <span
            className="lang-badge"
            style={{ '--lang-color': langColor } as React.CSSProperties}
          >
            <span className="lang-dot" />
            {snippet.language}
          </span>
          <h3 className="snippet-title">{snippet.title}</h3>
        </div>

        <div className="snippet-actions-top">
          {showDeleteConfirm ? (
            <div
              className="delete-confirm-box"
              onKeyDown={handleDeleteConfirmKeyDown}
            >
              <span className="delete-confirm-label">Delete?</span>
              <button
                type="button"
                className="delete-confirm-cancel-btn"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onToggleFavorite(snippet.id)}
                className={`fav-btn ${snippet.isFavorite ? 'fav-active' : ''}`}
                title={snippet.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              >
                {snippet.isFavorite ? '★' : '☆'}
              </button>

              <button
                type="button"
                onClick={() => onEdit(snippet)}
                className="edit-btn"
                title="Edit snippet"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-btn"
                title="Delete snippet"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      <div className={`snippet-code-wrapper theme-${codeTheme}`}>
        <div className="code-header">
          <div className="code-dots">
            <span className="dot-red" title="Close" />
            <span className="dot-yellow" title="Minimize" />
            <span className="dot-green" title="Expand" />
          </div>

          <div className="code-header-right">
            <span className="code-filename">{snippet.language}</span>

            {onSelectTheme && (
              <button
                type="button"
                className="code-theme-badge"
                onClick={handleCycleTheme}
                title={`Theme: ${currentThemeObj.name} (Click to change)`}
              >
                <span
                  className="theme-mini-dot"
                  style={{ backgroundColor: currentThemeObj.previewColors[0] }}
                />
                <span>{currentThemeObj.name}</span>
              </button>
            )}
          </div>
        </div>

        <pre className="snippet-code">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>

      <div className="snippet-footer">
        <div className="snippet-tags">
          {snippet.tags.map((tag) => (
            <span key={tag} className="snippet-tag">
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`copy-btn ${copyState === 'copied' ? 'copied' : ''} ${copyState === 'error' ? 'copy-error' : ''}`}
          title={
            copyState === 'copied'
              ? 'Copied to clipboard'
              : copyState === 'error'
              ? 'Failed to copy code'
              : 'Copy code to clipboard'
          }
        >
          {copyState === 'copied' ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              Copied!
            </>
          ) : copyState === 'error' ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Failed to copy
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};