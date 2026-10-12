import type { Snippet } from '../types';

export function exportSnippets(snippets: Snippet[]) {
  const json = JSON.stringify(snippets, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'codepocket-backup.json';
  link.click();

  URL.revokeObjectURL(url);
}

export async function readSnippetsFromFile(file: File): Promise<Snippet[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error('File must contain a list of snippets');
  }

  for (const item of data) {
    if (!item.title || !item.code || !item.language) {
      throw new Error('Each snippet needs a title, code and language');
    }
  }

  // give new ids so they don't clash with existing snippets
  return data.map((item) => ({ ...item, id: crypto.randomUUID() }));
}