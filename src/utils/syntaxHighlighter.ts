import hljs from 'highlight.js';

const ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  yml: 'yaml',
  html: 'xml',
};

export function highlightCode(code: string, language?: string): string {
  if (!code) return '';
  const lang = (language && ALIASES[language.toLowerCase()]) || language?.toLowerCase() || '';
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  }
  return hljs.highlightAuto(code).value;
}
