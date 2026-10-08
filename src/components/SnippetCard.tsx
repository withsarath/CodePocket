import { useState, useMemo } from 'react';
import type { Snippet } from '../types';
import { highlightCode } from '../utils/syntaxHighlighter';
import { CODE_THEMES, type CodeThemeId } from '../types/themes';

interface SnippetCardProps {
  snippet: Snippet;
  codeTheme?: CodeThemeId;
  onToggleFavorite: (id: string) => void;
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
  onDelete,
  onSelectTheme,
}: SnippetCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    setIsExiting(true);
    setTimeout(() => onDelete(snippet.id), 300);
  };

  const handleCycleTheme = () => {
    if (!onSelectTheme) return;
    const currentIndex = CODE_THEMES.findIndex((t) => t.id === codeTheme);
    const nextTheme = CODE_THEMES[(currentIndex + 1) % CODE_THEMES.length];
    onSelectTheme(nextTheme.id);
  };

  const currentThemeObj = CODE_THEMES.find((t) => t.id === codeTheme) || CODE_THEMES[0];
  const langStyle = LANG_CONFIG[snippet.language.toLowerCase()] || LANG_CONFIG.other;

  const highlighted = useMemo(() => {
    return highlightCode(snippet.code, snippet.language);
  }, [snippet.code, snippet.language]);

  return (
    <div className={`snippet-card ${isExiting ? 'snippet-card-exit' : ''}`}>
      {/* Header */}
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
          <button
            onClick={() => onToggleFavorite(snippet.id)}
            className={`fav-btn ${snippet.isFavorite ? 'fav-active' : ''}`}
            aria-label="Toggle Favorite"
          >
            {snippet.isFavorite ? '★' : '☆'}
          </button>
          <button
            onClick={handleDelete}
            className="delete-btn"
            aria-label="Delete snippet"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      {/* Code Block with theme class */}
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
                <span className="theme-mini-dot" style={{ backgroundColor: currentThemeObj.previewColors[0] }} />
                <span>{currentThemeObj.name}</span>
              </button>
            )}
          </div>
        </div>
        <pre className="snippet-code">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>

      {/* Footer */}
      <div className="snippet-footer">
        <div className="snippet-tags">
          {snippet.tags.map((tag) => (
            <span key={tag} className="snippet-tag">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className={`copy-btn ${copied ? 'copied' : ''}`}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};