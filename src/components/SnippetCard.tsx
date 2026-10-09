import { useState, useMemo, useRef, useEffect } from 'react';
import type { Snippet } from '../types';
import { highlightCode } from '../utils/syntaxHighlighter';
import { copyTextToClipboard } from '../utils/clipboard';
import { CODE_THEMES, type CodeThemeId } from '../types/themes';

interface SnippetCardProps {
  /** The snippet data object to display */
  snippet: Snippet;
  /** Active syntax theme (e.g. 'tokyo-night') */
  codeTheme?: CodeThemeId;
  /** Callback to toggle star / favorite status */
  onToggleFavorite: (id: string) => void;
  /** Callback to edit the snippet */
  onEdit: (snippet: Snippet) => void;
  /** Callback to delete the snippet */
  onDelete: (id: string) => void;
  /** Callback to switch code theme */
  onSelectTheme?: (theme: CodeThemeId) => void;
}

/**
 * Visual styling lookup table for language badges.
 * Maps each language name to a complementary badge color, background, and border.
 */
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

/**
 * SnippetCard Component
 *
 * Displays a single code snippet in a clean card layout:
 * - Language badge & title
 * - Star/favorite, edit & delete buttons (with safe delete confirmation)
 * - Optional description
 * - Syntax-highlighted code block with macOS-style window dots & theme badge
 * - Tag chips & "Copy" button with visible success and error feedback
 */
export const SnippetCard = ({
  snippet,
  codeTheme = 'tokyo-night',
  onToggleFavorite,
  onEdit,
  onDelete,
  onSelectTheme,
}: SnippetCardProps) => {
  // State for copying status: idle, copied (success), or error
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  // State to trigger the smooth exit animation before removing the card
  const [isExiting, setIsExiting] = useState(false);

  // State to request explicit confirmation before deleting
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // References for focus management during delete confirmation
  const deleteBtnRef = useRef<HTMLButtonElement | null>(null);
  const cancelDeleteBtnRef = useRef<HTMLButtonElement | null>(null);

  // Auto-focus the cancel button when confirmation dialog appears
  useEffect(() => {
    if (showDeleteConfirm) {
      cancelDeleteBtnRef.current?.focus();
    }
  }, [showDeleteConfirm]);

  // Cancel deletion and return focus to the delete trigger button
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    // Return focus to delete button after confirmation dialog closes
    setTimeout(() => {
      deleteBtnRef.current?.focus();
    }, 0);
  };

  // Keyboard support for delete confirmation dialog (Escape cancels)
  const handleDeleteConfirmKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      handleCancelDelete();
    }
  };

  // 1. Copy to clipboard handler with error fallback and visible error feedback
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

  // 2. Confirmed delete handler with smooth exit animation
  const handleConfirmDelete = () => {
    setIsExiting(true);
    // Wait 300ms for the CSS exit animation to finish, then delete from state
    setTimeout(() => onDelete(snippet.id), 300);
  };

  // 3. Cycle to next code theme when user clicks the small theme pill on the card
  const handleCycleTheme = () => {
    if (!onSelectTheme) return;
    const currentIndex = CODE_THEMES.findIndex((theme) => theme.id === codeTheme);
    // Use modulo operator (%) to loop back to 0 when reaching the end of the list
    const nextIndex = (currentIndex + 1) % CODE_THEMES.length;
    const nextTheme = CODE_THEMES[nextIndex];
    onSelectTheme(nextTheme.id);
  };

  // Find theme details and language color styles
  const currentThemeObj = CODE_THEMES.find((theme) => theme.id === codeTheme) || CODE_THEMES[0];
  const langKey = snippet.language.toLowerCase();
  const langStyle = LANG_CONFIG[langKey] || LANG_CONFIG.other;

  // Memoize syntax highlighting with sanitization so it doesn't re-run on every render
  const highlightedCode = useMemo(() => {
    return highlightCode(snippet.code, snippet.language);
  }, [snippet.code, snippet.language]);

  return (
    <div className={`snippet-card ${isExiting ? 'snippet-card-exit' : ''}`}>
      {/* Card Header: Language badge, Title, and Action buttons */}
      <div className="snippet-header">
        <div className="snippet-header-left">
          {/* Language badge with custom CSS color variables */}
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
            /* Inline accessible confirmation prompt */
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
              {/* Favorite toggle star */}
              <button
                type="button"
                onClick={() => onToggleFavorite(snippet.id)}
                className={`fav-btn ${snippet.isFavorite ? 'fav-active' : ''}`}
                aria-label={snippet.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                title={snippet.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              >
                {snippet.isFavorite ? '★' : '☆'}
              </button>

              {/* Edit snippet button */}
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

              {/* Delete trash button (triggers confirmation) */}
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

      {/* Optional Description */}
      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      {/* Code Block with active theme class applied */}
      <div className={`snippet-code-wrapper theme-${codeTheme}`}>
        <div className="code-header">
          {/* macOS window control decoration dots */}
          <div className="code-dots" aria-hidden="true">
            <span className="dot-red" title="Close" />
            <span className="dot-yellow" title="Minimize" />
            <span className="dot-green" title="Expand" />
          </div>

          <div className="code-header-right">
            <span className="code-filename">{snippet.language}</span>

            {/* Quick theme pill button: click to cycle through themes */}
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

        {/* Highlighted & sanitized code display */}
        <pre className="snippet-code">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </div>

      {/* Card Footer: Tags and Copy button */}
      <div className="snippet-footer">
        <div className="snippet-tags">
          {snippet.tags.map((tag) => (
            <span key={tag} className="snippet-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* Copy button with visible success and error states */}
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
              {/* Checkmark icon */}
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
              {/* Error warning icon */}
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
              {/* Copy document icon */}
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