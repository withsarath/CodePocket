export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
}