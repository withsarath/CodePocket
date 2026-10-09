import { useState, useRef, useEffect } from 'react';
import { CODE_THEMES, type CodeThemeId } from '../types/themes';

interface CodeThemeSelectorProps {
  /** The currently selected code theme ID */
  currentTheme: CodeThemeId;
  /** Callback triggered when the user picks a new code theme */
  onSelectTheme: (theme: CodeThemeId) => void;
}

/**
 * CodeThemeSelector Component
 *
 * A custom dropdown menu that lets users choose their favorite color scheme
 * for the code snippet blocks (e.g. Tokyo Night, Dracula, GitHub Dark, etc.).
 *
 * Key React concepts demonstrated here:
 * 1. `useState` - tracks whether the dropdown popup is open or closed.
 * 2. `useRef` - points directly to the wrapper <div> to detect clicks outside.
 * 3. `useEffect` - listens for global mouse clicks to automatically close the menu.
 */
export const CodeThemeSelector = ({
  currentTheme,
  onSelectTheme,
}: CodeThemeSelectorProps) => {
  // Is the dropdown menu currently open?
  const [isOpen, setIsOpen] = useState(false);

  // Reference to the dropdown container to check for outside clicks
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the full theme object matching the current theme ID (fallback to first theme)
  const activeTheme = CODE_THEMES.find((theme) => theme.id === currentTheme) || CODE_THEMES[0];

  // Close the dropdown menu if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside =
        containerRef.current &&
        !containerRef.current.contains(event.target as Node);

      if (clickedOutside) {
        setIsOpen(false);
      }
    };

    // Listen for mousedown anywhere on the page
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener when this component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (themeId: CodeThemeId) => {
    onSelectTheme(themeId);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="theme-selector-container" ref={containerRef}>
      {/* Trigger button that opens/closes the dropdown */}
      <button
        type="button"
        className={`theme-selector-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Change Code Snippet Color Theme"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* Palette icon */}
        <span className="theme-icon">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
        </span>

        {/* Current theme name */}
        <span className="theme-name">{activeTheme.name}</span>

        {/* Three mini preview color dots */}
        <span className="theme-dots-preview">
          {activeTheme.previewColors.map((color, index) => (
            <span
              key={index}
              className="theme-preview-dot"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>

        {/* Dropdown chevron arrow */}
        <svg
          className={`theme-chevron ${isOpen ? 'rotate' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Floating theme selection menu */}
      {isOpen && (
        <div className="theme-dropdown-menu" role="listbox">
          <div className="theme-dropdown-header">Code Color Theme</div>
          {CODE_THEMES.map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(theme.id)}
                role="option"
                aria-selected={isSelected}
              >
                <div className="theme-item-left">
                  {/* Theme preview dots */}
                  <div className="theme-item-dots">
                    {theme.previewColors.map((dotColor, dotIndex) => (
                      <span
                        key={dotIndex}
                        className="theme-preview-dot"
                        style={{ backgroundColor: dotColor }}
                      />
                    ))}
                  </div>
                  <span className="theme-item-name">{theme.name}</span>
                </div>

                {/* Checkmark icon for currently selected theme */}
                {isSelected && (
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

