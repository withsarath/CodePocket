import hljs from 'highlight.js';

/**
 * Common abbreviations mapped to the official names used by highlight.js.
 * Example: users might type "js", but highlight.js expects "javascript".
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  rs: 'rust',
  golang: 'go',
  cs: 'csharp',
  rb: 'ruby',
  html: 'xml',
  svg: 'xml',
};

/**
 * Escapes special HTML characters so raw code text displays safely in HTML
 * without being interpreted as HTML tags.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Highlights a snippet of source code using highlight.js.
 *
 * Steps:
 * 1. Checks if code exists; if empty, returns an empty string.
 * 2. Normalizes the language name (converts to lowercase and checks aliases).
 * 3. Tries to highlight using the specified language.
 * 4. If the language isn't recognized, tries auto-detection.
 * 5. If everything fails, safely escapes the raw code for safe HTML rendering.
 *
 * @param code - The plain source code string to highlight.
 * @param language - Optional language name (e.g., 'typescript', 'python').
 * @returns An HTML string with syntax highlighting spans.
 */
export function highlightCode(code: string, language?: string): string {
  // Guard clause: return early if there is no code
  if (!code) {
    return '';
  }

  // Step 1: Clean up and resolve the language name
  const cleanLang = (language || '').toLowerCase().trim();
  const targetLanguage = LANGUAGE_ALIASES[cleanLang] || cleanLang;

  // Step 2: If highlight.js knows this language, highlight with it
  if (targetLanguage && hljs.getLanguage(targetLanguage)) {
    try {
      const result = hljs.highlight(code, {
        language: targetLanguage,
        ignoreIllegals: true,
      });
      return result.value;
    } catch (error) {
      console.warn('highlight.js error with language:', targetLanguage, error);
    }
  }

  // Step 3: Fallback - let highlight.js try to automatically detect the language
  try {
    const autoResult = hljs.highlightAuto(code);
    if (autoResult && autoResult.value) {
      return autoResult.value;
    }
  } catch (error) {
    console.warn('highlight.js auto-detection error:', error);
  }

  // Step 4: Final fallback - safely escape characters for HTML display
  return escapeHtml(code);
}

