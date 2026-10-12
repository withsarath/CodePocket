import type { Snippet } from '../types';

/**
 * Generates a unique ID for an imported snippet.
 */
function generateSnippetId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `snippet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Exports the snippets array as a JSON file and triggers a browser download.
 *
 * @param snippets Array of snippets to export
 * @param filename File name for the downloaded file (defaults to codepocket-backup.json)
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
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('Invalid JSON format: The selected file could not be parsed as JSON.');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Invalid backup format: The file must contain a JSON array of snippets.');
  }

  if (parsed.length === 0) {
    throw new Error('The backup file contains an empty array (no snippets found).');
  }

  const validatedSnippets: Snippet[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];

    if (!item || typeof item !== 'object') {
      throw new Error(`Snippet #${i + 1} is invalid (expected an object).`);
    }

    const { title, code, language, description, tags, isFavorite, createdAt, updatedAt } =
      item as Record<string, unknown>;

    if (typeof title !== 'string' || !title.trim()) {
      throw new Error(`Snippet #${i + 1} is missing a required "title" string.`);
    }

    if (typeof code !== 'string') {
      throw new Error(`Snippet #${i + 1} ("${title}") is missing required "code" string.`);
    }

    if (typeof language !== 'string' || !language.trim()) {
      throw new Error(`Snippet #${i + 1} ("${title}") is missing required "language" string.`);
    }

    // Prepare clean tags array
    const cleanTags: string[] = Array.isArray(tags)
      ? tags
          .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
          .filter(Boolean)
      : [];

    validatedSnippets.push({
      // Assign a new ID to avoid any duplicates or ID collisions with existing snippets
      id: generateSnippetId(),
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      code,
      language: language.trim().toLowerCase(),
      tags: cleanTags,
      isFavorite: Boolean(isFavorite),
      createdAt: typeof createdAt === 'number' ? createdAt : Date.now(),
      updatedAt: typeof updatedAt === 'number' ? updatedAt : undefined,
    });
  }

  return validatedSnippets;
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
