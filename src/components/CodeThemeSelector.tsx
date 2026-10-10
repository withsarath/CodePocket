import { useState, useRef, useEffect } from 'react';
import { CODE_THEMES, type CodeThemeId } from '../types/themes';

interface CodeThemeSelectorProps {
  currentTheme: CodeThemeId;
  onSelectTheme: (theme: CodeThemeId) => void;
}

export const CodeThemeSelector = ({
  currentTheme,
  onSelectTheme,
}: CodeThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTheme = CODE_THEMES.find((theme) => theme.id === currentTheme) || CODE_THEMES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (themeId: CodeThemeId) => {
    onSelectTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector-container" ref={containerRef}>
      <button
        type="button"
        className={`theme-selector-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Change Code Snippet Color Theme"
      >
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
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
        </span>

        <span className="theme-name">{activeTheme.name}</span>

        <span className="theme-dots-preview">
          {activeTheme.previewColors.map((color, index) => (
            <span
              key={index}
              className="theme-preview-dot"
              style={{ backgroundColor: color }}
            />
          ))}
        </span>

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
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu">
          <div className="theme-dropdown-header">Code Color Theme</div>
          {CODE_THEMES.map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(theme.id)}
              >
                <div className="theme-item-left">
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
