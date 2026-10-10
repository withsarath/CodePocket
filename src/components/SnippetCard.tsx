import { useState, useMemo, useRef, useEffect } from 'react';
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

const LANG_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  typescript: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.28)' },
  javascript: { color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)', border: 'rgba(250, 204, 21, 0.28)' },
  python: { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', border: 'rgba(96, 165, 250, 0.28)' },
  sql: { color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.1)', border: 'rgba(45, 212, 191, 0.28)' },
  bash: { color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.28)' },
  css: { color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)', border: 'rgba(192, 132, 252, 0.28)' },
  html: { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.28)' },
  yaml: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.28)' },
  rust: { color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)', border: 'rgba(251, 146, 60, 0.28)' },
  go: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.28)' },
  java: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.28)' },
  csharp: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', border: 'rgba(52, 211, 153, 0.28)' },
  ruby: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.28)' },
  php: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.28)' },
  other: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.28)' },
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
  const [isExiting, setIsExiting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteBtnRef = useRef<HTMLButtonElement | null>(null);
  const cancelDeleteBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (showDeleteConfirm) {
      cancelDeleteBtnRef.current?.focus();
    }
  }, [showDeleteConfirm]);

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setTimeout(() => {
      deleteBtnRef.current?.focus();
    }, 0);
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
      setTimeout(() => setCopyState('idle'), 3000);
    }
  };

  const handleConfirmDelete = () => {
    setIsExiting(true);
    setTimeout(() => onDelete(snippet.id), 300);
  };

  const handleCycleTheme = () => {
    if (!onSelectTheme) return;
    const currentIndex = CODE_THEMES.findIndex((theme) => theme.id === codeTheme);
    const nextIndex = (currentIndex + 1) % CODE_THEMES.length;
    onSelectTheme(CODE_THEMES[nextIndex].id);
  };

  const currentThemeObj = CODE_THEMES.find((theme) => theme.id === codeTheme) || CODE_THEMES[0];
  const langKey = snippet.language.toLowerCase();
  const langStyle = LANG_CONFIG[langKey] || LANG_CONFIG.other;

  const highlightedCode = useMemo(() => {
    return highlightCode(snippet.code, snippet.language);
  }, [snippet.code, snippet.language]);

  return (
    <div className={`snippet-card ${isExiting ? 'snippet-card-exit' : ''}`}>
      <div className="snippet-header">
        <div className="snippet-header-left">
          <span
            className="lang-badge"
            style={{
              '--lang-color': langStyle.color,
              '--lang-bg': langStyle.bg,
              '--lang-border': langStyle.border,
            } as React.CSSProperties}
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
              role="alertdialog"
              aria-label="Confirm snippet deletion"
              onKeyDown={handleDeleteConfirmKeyDown}
            >
              <span className="delete-confirm-label">Delete?</span>
              <button
                ref={cancelDeleteBtnRef}
                type="button"
                className="delete-confirm-cancel-btn"
                onClick={handleCancelDelete}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleConfirmDelete}
                aria-label={`Confirm delete ${snippet.title}`}
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
                aria-label={snippet.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                title={snippet.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              >
                {snippet.isFavorite ? '★' : '☆'}
              </button>

              <button
                type="button"
                onClick={() => onEdit(snippet)}
                className="edit-btn"
                aria-label={`Edit ${snippet.title}`}
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
                  aria-hidden="true"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>

              <button
                ref={deleteBtnRef}
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-btn"
                aria-label={`Delete ${snippet.title}`}
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
                  aria-hidden="true"
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
          <div className="code-dots" aria-hidden="true">
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
          aria-live="polite"
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
                aria-hidden="true"
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
                aria-hidden="true"
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
                aria-hidden="true"
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