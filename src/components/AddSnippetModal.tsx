import { useState } from 'react';
import type { Snippet } from '../types';

interface AddSnippetModalProps {
  /** Controls whether the modal pop-up is visible */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Function called when the user successfully submits a new snippet */
  onAdd: (snippet: Snippet) => void;
}

/** Supported programming languages in the dropdown */
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

/**
 * AddSnippetModal Component
 *
 * A modal pop-up dialog that contains a form for creating and saving
 * a new code snippet to CodePocket.
 */
export const AddSnippetModal = ({ isOpen, onClose, onAdd }: AddSnippetModalProps) => {
  // Form input states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tagsInput, setTagsInput] = useState('');

  // Resets all form fields back to empty defaults
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('javascript');
    setTagsInput('');
  };

  // Handles form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Stop standard browser page reload

    const cleanTitle = title.trim();
    const cleanCode = code.trim();

    // Guard: ensure required fields are not just empty spaces
    if (!cleanTitle || !cleanCode) {
      return;
    }

    // Convert comma-separated string into a clean array of lowercase tags
    // e.g., "React, Hooks, Web" -> ["react", "hooks", "web"]
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    // Build the new Snippet object
    const newSnippet: Snippet = {
      id: crypto.randomUUID(), // Generates a unique ID like "36b8f84d-df4e-4d49-b662-bcde71a8764f"
      title: cleanTitle,
      description: description.trim(),
      code: cleanCode,
      language,
      tags,
      isFavorite: false,
      createdAt: Date.now(),
    };

    // Send the new snippet to the parent App component
    onAdd(newSnippet);

    // Clear form inputs and close modal
    resetForm();
    onClose();
  };

  // Close modal when user clicks on the backdrop (outside the white/dark modal box)
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // If modal is not open, do not render anything to the DOM
  if (!isOpen) {
    return null;
  }

  // Check if form is ready to submit (both title and code have text)
  const isSubmitDisabled = !title.trim() || !code.trim();

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* Click inside modal card should NOT trigger handleOverlayClick */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">+</span>
            New Snippet
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title field */}
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
              autoFocus
            />
          </div>

          {/* Description field */}
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

          {/* Row with Language selector and Tags input */}
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

          {/* Code text area */}
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

          {/* Form action buttons */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitDisabled}
            >
              Add Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

