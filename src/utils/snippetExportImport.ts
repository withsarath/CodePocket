import type { Snippet } from '../types';

/**
 * Exports the snippets array as a JSON file and triggers a browser download.
 */
export function exportSnippets(
  snippets: Snippet[],
  filename = 'codepocket-backup.json'
): void {
  const jsonString = JSON.stringify(snippets, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Parses and validates raw JSON text into an array of Snippet objects.
 * Throws an Error with a descriptive message if the content is invalid.
 */
export function parseAndValidateSnippets(jsonText: string): Snippet[] {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('Invalid file format: must be an array of snippets with a title, code, and language.');
  }

  const isValid =
    Array.isArray(parsed) &&
    parsed.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.title === 'string' &&
        typeof item.code === 'string' &&
        typeof item.language === 'string'
    );

  if (!isValid) {
    throw new Error('Invalid file format: must be an array of snippets with a title, code, and language.');
  }

  return parsed.map((item: any) => ({
    id: crypto.randomUUID(),
    title: String(item.title).trim(),
    description: typeof item.description === 'string' ? item.description.trim() : '',
    code: String(item.code),
    language: String(item.language).trim().toLowerCase(),
    tags: Array.isArray(item.tags)
      ? item.tags.map((t: unknown) => String(t).trim().toLowerCase()).filter(Boolean)
      : [],
    isFavorite: Boolean(item.isFavorite),
    createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
    updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : undefined,
  }));
}

/**
 * Reads a JSON file using FileReader and validates snippets.
 */
export function readSnippetsFromFile(file: File): Promise<Snippet[]> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file was selected.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Failed to read file content.');
        }
        const snippets = parseAndValidateSnippets(text);
        resolve(snippets);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('An error occurred while reading the file from disk.'));
    };

    reader.readAsText(file);
  });
}
