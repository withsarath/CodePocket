/**
 * Represents a single code snippet saved in CodePocket.
 * This interface defines all the properties each snippet must have.
 */
export interface Snippet {
  /** Unique ID for each snippet (generated using crypto.randomUUID()) */
  id: string;

  /** Short, descriptive title (e.g., "Custom Hook: useLocalStorage") */
  title: string;

  /** Optional explanation of what the snippet does and when to use it */
  description: string;

  /** The actual source code content */
  code: string;

  /** Programming language name (e.g., "javascript", "python", "typescript") */
  language: string;

  /** List of topic keywords/tags for filtering (e.g., ["react", "hooks"]) */
  tags: string[];

  /** Whether the user has marked this snippet as a favorite */
  isFavorite: boolean;

  /** Timestamp (in milliseconds) when the snippet was created */
  createdAt: number;

  /** Optional timestamp (in milliseconds) when the snippet was last updated */
  updatedAt?: number;
}