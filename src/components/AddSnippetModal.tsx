import { useState, useEffect } from 'react';
import type { Snippet } from '../types';

export interface AddSnippetModalProps {
  /** Controls whether the modal pop-up is visible */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Function called when the user successfully submits a snippet (create or update) */
  onSave?: (snippet: Snippet) => void;
  /** Function called when the user successfully submits a new snippet (backwards-compatible alias) */
  onAdd?: (snippet: Snippet) => void;
  /** Existing snippet to edit. If null/undefined, modal is in Create mode */
  editingSnippet?: Snippet | null;
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

interface ModalContentProps {
  onClose: () => void;
  onSave?: (snippet: Snippet) => void;
  onAdd?: (snippet: Snippet) => void;
  editingSnippet?: Snippet | null;
}

/**
 * Inner modal content component.
 * Remounted whenever the target snippet changes (via key in parent)
 * so form state initializes cleanly with zero useEffect cascading renders.
 */
const SnippetModalContent = ({
  onClose,
  onSave,
  onAdd,
  editingSnippet,
}: ModalContentProps) => {
  const isEditing = Boolean(editingSnippet);

  // Form input states initialized directly from snippet (if editing)
  const [title, setTitle] = useState(editingSnippet?.title ?? '');
  const [description, setDescription] = useState(editingSnippet?.description ?? '');
  const [code, setCode] = useState(editingSnippet?.code ?? '');
  const [language, setLanguage] = useState(editingSnippet?.language ?? 'javascript');
  const [tagsInput, setTagsInput] = useState(editingSnippet?.tags.join(', ') ?? '');

  // Handles form submission (Create or Update)
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

    if (editingSnippet) {
      // Build the updated Snippet object, preserving original id, favorite, and createdAt
      const updatedSnippet: Snippet = {
        ...editingSnippet,
        title: cleanTitle,
        description: description.trim(),
        code: cleanCode,
        language,
        tags,
        updatedAt: Date.now(),
      };

      if (onSave) {
        onSave(updatedSnippet);
      } else if (onAdd) {
        onAdd(updatedSnippet);
      }
    } else {
      // Build the new Snippet object
      const newSnippet: Snippet = {
        id: crypto.randomUUID(),
        title: cleanTitle,
        description: description.trim(),
        code: cleanCode,
        language,
        tags,
        isFavorite: false,
        createdAt: Date.now(),
      };

      if (onSave) {
        onSave(newSnippet);
      } else if (onAdd) {
        onAdd(newSnippet);
      }
    }

    onClose();
  };

  // Check if form is ready to submit (both title and code have text)
  const isSubmitDisabled = !title.trim() || !code.trim();

  return (
    <>
      {/* Modal Header */}
      <div className="modal-header">
        <h2 id="modal-title-heading" className="modal-title">
          <span className="modal-title-icon" aria-hidden="true">
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
            {isEditing ? 'Save Changes' : 'Add Snippet'}
          </button>
        </div>
      </form>
    </>
  );
};

/**
 * AddSnippetModal (SnippetModal) Component
 *
 * A reusable modal pop-up dialog that contains a form for creating new snippets
 * or updating existing code snippets in CodePocket.
 */
export const AddSnippetModal = ({
  isOpen,
  onClose,
  onSave,
  onAdd,
  editingSnippet = null,
}: AddSnippetModalProps) => {
  // Handle closing modal with Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // If modal is not open, do not render anything to the DOM
  if (!isOpen) {
    return null;
  }

  // Close modal when user clicks on the backdrop (outside the modal box)
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title-heading"
    >
      {/* Click inside modal card should NOT trigger handleOverlayClick */}
      <div
        key={editingSnippet ? editingSnippet.id : 'create-snippet'}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <SnippetModalContent
          onClose={onClose}
          onSave={onSave}
          onAdd={onAdd}
          editingSnippet={editingSnippet}
        />
      </div>
    </div>
  );
};

/** Alias for semantic clarity */
export const SnippetModal = AddSnippetModal;
