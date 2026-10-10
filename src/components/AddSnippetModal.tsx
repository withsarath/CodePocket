import { useState, useEffect, useRef } from 'react';
import type { Snippet } from '../types';

export interface AddSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (snippet: Snippet) => void;
  onAdd?: (snippet: Snippet) => void;
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

interface ModalContentProps {
  onClose: () => void;
  onSave?: (snippet: Snippet) => void;
  onAdd?: (snippet: Snippet) => void;
  editingSnippet?: Snippet | null;
  firstInputRef: React.RefObject<HTMLInputElement | null>;
}

const SnippetModalContent = ({
  onClose,
  onSave,
  onAdd,
  editingSnippet,
  firstInputRef,
}: ModalContentProps) => {
  const isEditing = Boolean(editingSnippet);

  const [title, setTitle] = useState(editingSnippet?.title ?? '');
  const [description, setDescription] = useState(editingSnippet?.description ?? '');
  const [code, setCode] = useState(editingSnippet?.code ?? '');
  const [language, setLanguage] = useState(editingSnippet?.language ?? 'javascript');
  const [tagsInput, setTagsInput] = useState(editingSnippet?.tags.join(', ') ?? '');

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

  const isSubmitDisabled = !title.trim() || !code.trim();

  return (
    <>
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
          aria-label="Close modal (Escape)"
          title="Close modal (Escape)"
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
            ref={firstInputRef}
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
    </>
  );
};

export const AddSnippetModal = ({
  isOpen,
  onClose,
  onSave,
  onAdd,
  editingSnippet = null,
}: AddSnippetModalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;

      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        triggerElementRef.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // Trap focus inside modal
      if (event.key === 'Tab' && containerRef.current) {
        const focusableSelectors =
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

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
      <div
        ref={containerRef}
        key={editingSnippet ? editingSnippet.id : 'create-snippet'}
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <SnippetModalContent
          onClose={onClose}
          onSave={onSave}
          onAdd={onAdd}
          editingSnippet={editingSnippet}
          firstInputRef={firstInputRef}
        />
      </div>
    </div>
  );
};

export const SnippetModal = AddSnippetModal;
