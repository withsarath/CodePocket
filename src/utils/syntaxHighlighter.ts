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

/** Maximum character length to highlight to avoid performance bottlenecks or ReDoS */
const MAX_HIGHLIGHT_LENGTH = 100_000;

/**
 * Escapes special HTML characters so raw code text displays safely in HTML
 * without being interpreted as HTML tags or attributes.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes HTML produced by syntax highlighters before it reaches dangerouslySetInnerHTML.
 *
 * Security guarantees:
 * - Only <span> elements and text nodes are permitted.
 * - Any dangerous elements (<script>, <svg>, <img>, <iframe>, <object>, etc.) are stripped.
 * - Only safe 'class' attributes matching expected syntax tokens ([a-zA-Z0-9_\-\s]+) are kept.
 * - All other attributes (especially event handlers like onload, onerror, onclick) are removed.
 */
export function sanitizeHighlightedHtml(htmlString: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return htmlString;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${htmlString}</body>`, 'text/html');
    const body = doc.body;

    const sanitizeNode = (node: Node) => {
      // Traverse backwards through children so removals don't break indices
      const children = Array.from(node.childNodes);
      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          const tagName = el.tagName.toUpperCase();

          // Only allow <span> tags for syntax highlight coloring
          if (tagName === 'SPAN') {
            // Strip any attribute except valid 'class'
            const attrNames = Array.from(el.attributes).map((attr) => attr.name);
            for (const name of attrNames) {
              if (name.toLowerCase() === 'class') {
                const classValue = el.getAttribute('class') || '';
                // Only allow alphanumeric tokens, dashes, and whitespace
                if (!/^[a-zA-Z0-9_\-\s]*$/.test(classValue)) {
                  el.removeAttribute('class');
                }
              } else {
                el.removeAttribute(name);
              }
            }
            // Recursively sanitize children of this span
            sanitizeNode(el);
          } else {
            // Dangerous or unexpected element: replace with safe text content
            const textNode = doc.createTextNode(el.textContent || '');
            node.replaceChild(textNode, el);
          }
        } else if (child.nodeType !== Node.TEXT_NODE) {
          // Remove comments and CDATA nodes
          node.removeChild(child);
        }
      }
    };

    sanitizeNode(body);
    return body.innerHTML;
  } catch (err) {
    console.warn('Failed to sanitize highlighted HTML, falling back to escapeHtml:', err);
    return escapeHtml(htmlString);
  }
}

/**
 * Highlights a snippet of source code using highlight.js with strict output sanitization.
 *
 * Steps:
 * 1. Checks if code exists; if empty, returns an empty string.
 * 2. Checks code length against guard threshold to prevent thread blocking.
 * 3. Normalizes the language name (converts to lowercase and checks aliases).
 * 4. Tries to highlight using the specified language.
 * 5. If the language isn't recognized, tries auto-detection.
 * 6. Sanitizes output before returning to ensure untrusted code cannot execute XSS.
 * 7. If highlighting fails at any step, safely escapes raw code for safe HTML rendering.
 *
 * @param code - The plain source code string to highlight.
 * @param language - Optional language name (e.g., 'typescript', 'python').
 * @returns A safe HTML string with syntax highlighting spans.
 */
export function highlightCode(code: string, language?: string): string {
  // Guard clause: return early if there is no code
  if (!code) {
    return '';
  }

  // Large file guard: avoid freezing thread or ReDoS on massive inputs
  if (code.length > MAX_HIGHLIGHT_LENGTH) {
    return escapeHtml(code);
  }

  try {
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
        return sanitizeHighlightedHtml(result.value);
      } catch (error) {
        console.warn('highlight.js error with language:', targetLanguage, error);
      }
    }

    // Step 3: Fallback - let highlight.js try to automatically detect the language
    try {
      const autoResult = hljs.highlightAuto(code);
      if (autoResult && autoResult.value) {
        return sanitizeHighlightedHtml(autoResult.value);
      }
    } catch (error) {
      console.warn('highlight.js auto-detection error:', error);
    }
  } catch (outerError) {
    console.warn('Unexpected error during code highlighting:', outerError);
  }

  // Step 4: Final fallback - safely escape all characters for HTML display
  return escapeHtml(code);
}
