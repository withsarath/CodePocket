import { useState, useEffect } from 'react';
import type { Snippet } from '../types';

export interface AddSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (snippet: Snippet) => void;
  editingSnippet?: Snippet | null;
}

const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'sql',
  'bash',
  'css',
  'html',
  'yaml',
  'rust',
  'go',
  'java',
  'csharp',
  'ruby',
  'php',
  'other',
];

export const AddSnippetModal = ({
  isOpen,
  onClose,
  onSave,
  editingSnippet = null,
}: AddSnippetModalProps) => {
  const isEditing = Boolean(editingSnippet);

  const [title, setTitle] = useState(editingSnippet?.title ?? '');
  const [description, setDescription] = useState(editingSnippet?.description ?? '');
  const [code, setCode] = useState(editingSnippet?.code ?? '');
  const [language, setLanguage] = useState(editingSnippet?.language ?? 'javascript');
  const [tagsInput, setTagsInput] = useState(editingSnippet?.tags.join(', ') ?? '');

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanCode = code.trim();

    if (!cleanTitle || !cleanCode) {
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    if (editingSnippet) {
      onSave({
        ...editingSnippet,
        title: cleanTitle,
        description: description.trim(),
        code: cleanCode,
        language,
        tags,
        updatedAt: Date.now(),
      });
    } else {
      onSave({
        id: crypto.randomUUID(),
        title: cleanTitle,
        description: description.trim(),
        code: cleanCode,
        language,
        tags,
        isFavorite: false,
        createdAt: Date.now(),
      });
    }

    onClose();
  };

  const isSubmitDisabled = !title.trim() || !code.trim();

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">
              {isEditing ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              ) : (
                '+'
              )}
            </span>
            {isEditing ? 'Edit Snippet' : 'New Snippet'}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            title="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="snippet-title" className="form-label">
              Title *
            </label>
            <input
              id="snippet-title"
              type="text"
              className="form-input"
              placeholder="e.g. useDebounce Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="snippet-description" className="form-label">
              Description
            </label>
            <input
              id="snippet-description"
              type="text"
              className="form-input"
              placeholder="Brief description of the snippet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-group-half">
              <label htmlFor="snippet-language" className="form-label">
                Language
              </label>
              <select
                id="snippet-language"
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-half">
              <label htmlFor="snippet-tags" className="form-label">
                Tags
              </label>
              <input
                id="snippet-tags"
                type="text"
                className="form-input"
                placeholder="react, hooks, utility"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              <span className="form-hint">Comma-separated</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="snippet-code" className="form-label">
              Code *
            </label>
            <textarea
              id="snippet-code"
              className="form-textarea"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              rows={8}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitDisabled}
            >
              {isEditing ? 'Save Changes' : 'Add Snippet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
