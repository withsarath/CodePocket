import hljs from 'highlight.js';

// Map common shorthand language names to what highlight.js expects
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

const MAX_HIGHLIGHT_LENGTH = 100_000;

// Escapes HTML special characters so code displays safely
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Strips anything unsafe from highlight.js output before using dangerouslySetInnerHTML.
// Only allows <span> tags with valid class attributes.
export function sanitizeHighlightedHtml(htmlString: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return htmlString;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${htmlString}</body>`, 'text/html');
    const body = doc.body;

    const sanitizeNode = (node: Node) => {
      const children = Array.from(node.childNodes);
      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          const tagName = el.tagName.toUpperCase();

          if (tagName === 'SPAN') {
            const attrNames = Array.from(el.attributes).map((attr) => attr.name);
            for (const name of attrNames) {
              if (name.toLowerCase() === 'class') {
                const classValue = el.getAttribute('class') || '';
                if (!/^[a-zA-Z0-9_\-\s]*$/.test(classValue)) {
                  el.removeAttribute('class');
                }
              } else {
                el.removeAttribute(name);
              }
            }
            sanitizeNode(el);
          } else {
            const textNode = doc.createTextNode(el.textContent || '');
            node.replaceChild(textNode, el);
          }
        } else if (child.nodeType !== Node.TEXT_NODE) {
          node.removeChild(child);
        }
      }
    };

    sanitizeNode(body);
    return body.innerHTML;
  } catch (err) {
    console.warn('Failed to sanitize HTML, falling back to escapeHtml:', err);
    return escapeHtml(htmlString);
  }
}

// Highlights code using highlight.js and returns a safe HTML string
export function highlightCode(code: string, language?: string): string {
  if (!code) return '';

  // Skip highlighting for very large files to avoid freezing
  if (code.length > MAX_HIGHLIGHT_LENGTH) {
    return escapeHtml(code);
  }

  try {
    const cleanLang = (language || '').toLowerCase().trim();
    const targetLanguage = LANGUAGE_ALIASES[cleanLang] || cleanLang;

    if (targetLanguage && hljs.getLanguage(targetLanguage)) {
      try {
        const result = hljs.highlight(code, {
          language: targetLanguage,
          ignoreIllegals: true,
        });
        return sanitizeHighlightedHtml(result.value);
      } catch (error) {
        console.warn('highlight.js error for language:', targetLanguage, error);
      }
    }

    // Fallback: auto-detect the language
    try {
      const autoResult = hljs.highlightAuto(code);
      if (autoResult?.value) {
        return sanitizeHighlightedHtml(autoResult.value);
      }
    } catch (error) {
      console.warn('highlight.js auto-detect error:', error);
    }
  } catch (outerError) {
    console.warn('Unexpected highlighting error:', outerError);
  }

  return escapeHtml(code);
}
