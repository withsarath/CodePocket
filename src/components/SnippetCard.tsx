import { useState, useMemo } from 'react';
import type { Snippet } from '../types';
import { highlightCode } from '../utils/syntaxHighlighter';
import { copyTextToClipboard } from '../utils/clipboard';
import { CODE_THEMES, type CodeThemeId } from '../types/themes';

interface SnippetCardProps {
  snippet: Snippet;
  codeTheme: CodeThemeId;
  onToggleFavorite: (id: string) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onSelectTheme: (theme: CodeThemeId) => void;
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
  codeTheme,
  onToggleFavorite,
  onEdit,
  onDelete,
  onSelectTheme,
}: SnippetCardProps) => {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(snippet.code);
    setCopyState(ok ? 'copied' : 'error');
    setTimeout(() => setCopyState('idle'), 2000);
  };

  // go to the next code theme in the list (and back to the first at the end)
  const handleCycleTheme = () => {
    const currentIndex = CODE_THEMES.findIndex((theme) => theme.id === codeTheme);
    const nextIndex = (currentIndex + 1) % CODE_THEMES.length;
    onSelectTheme(CODE_THEMES[nextIndex].id);
  };

  const currentThemeObj =
    CODE_THEMES.find((theme) => theme.id === codeTheme) || CODE_THEMES[0];
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
            <div className="delete-confirm-box">
              <span className="delete-confirm-label">Delete?</span>
              <button
                type="button"
                className="delete-confirm-cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={() => onDelete(snippet.id)}
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
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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
            <span className="dot-red" />
            <span className="dot-yellow" />
            <span className="dot-green" />
          </div>

          <div className="code-header-right">
            <span className="code-filename">{snippet.language}</span>

            <button
              type="button"
              className="code-theme-badge"
              onClick={handleCycleTheme}
              title={`Theme: ${currentThemeObj.name} (click to change)`}
            >
              <span
                className="theme-mini-dot"
                style={{ backgroundColor: currentThemeObj.previewColors[0] }}
              />
              <span>{currentThemeObj.name}</span>
            </button>
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
        >
          {copyState === 'copied'
            ? 'Copied!'
            : copyState === 'error'
            ? 'Failed'
            : 'Copy'}
        </button>
      </div>
    </div>
  );
};