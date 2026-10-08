import { useState } from 'react';
import type { Snippet } from '../types';

interface SnippetCardProps {
  snippet: Snippet;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const LANG_COLORS: Record<string, string> = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  python: '#3572A5',
  sql: '#e38c00',
  bash: '#4EAA25',
  css: '#563d7c',
  html: '#e34c26',
  yaml: '#cb171e',
  rust: '#dea584',
  go: '#00ADD8',
  java: '#b07219',
  csharp: '#178600',
  ruby: '#701516',
  php: '#4F5D95',
  other: '#6b7280',
};

export const SnippetCard = ({ snippet, onToggleFavorite, onDelete }: SnippetCardProps) => {
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

  const langColor = LANG_COLORS[snippet.language] || LANG_COLORS.other;

  return (
    <div className={`snippet-card ${isExiting ? 'snippet-card-exit' : ''}`}>
      {/* Header */}
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

      {/* Code Block */}
      <div className="snippet-code-wrapper">
        <div className="code-header">
          <div className="code-dots">
            <span /><span /><span />
          </div>
          <span className="code-filename">{snippet.language}</span>
        </div>
        <pre className="snippet-code">
          <code>{snippet.code}</code>
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