import { useState } from 'react';
import type { Snippet } from '../types';

interface AddSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (snippet: Snippet) => void;
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

export const AddSnippetModal = ({ isOpen, onClose, onAdd }: AddSnippetModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newSnippet: Snippet = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      tags,
      isFavorite: false,
      createdAt: Date.now(),
    };

    onAdd(newSnippet);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('javascript');
    setTagsInput('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">+</span>
            New Snippet
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="snippet-title" className="form-label">Title *</label>
            <input
              id="snippet-title"
              type="text"
              className="form-input"
              placeholder="e.g. useDebounce Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="snippet-description" className="form-label">Description</label>
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
              <label htmlFor="snippet-language" className="form-label">Language</label>
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
              <label htmlFor="snippet-tags" className="form-label">Tags</label>
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
            <label htmlFor="snippet-code" className="form-label">Code *</label>
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
              disabled={!title.trim() || !code.trim()}
            >
              Add Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
