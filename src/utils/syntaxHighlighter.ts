import hljs from 'highlight.js';

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

export function highlightCode(code: string, language?: string): string {
  if (!code) return '';

  const normalized = (language || '').toLowerCase().trim();
  const targetLang = LANGUAGE_ALIASES[normalized] || normalized;

  if (targetLang && hljs.getLanguage(targetLang)) {
    try {
      return hljs.highlight(code, {
        language: targetLang,
        ignoreIllegals: true,
      }).value;
    } catch (e) {
      console.warn('highlight.js lang error:', e);
    }
  }

  // Fallback to auto-detection
  try {
    const autoResult = hljs.highlightAuto(code);
    if (autoResult && autoResult.value) {
      return autoResult.value;
    }
  } catch (e) {
    console.warn('highlight.js auto error:', e);
  }

  // Safe HTML escaping fallback
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
