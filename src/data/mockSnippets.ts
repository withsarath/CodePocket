import type { Snippet } from "../types/index";

export const initialSnippets: Snippet[] = [
  {
    id: "1",
    title: "Custom Hook: useLocalStorage",
    description:
      "Sync component state directly with localStorage and listen for cross-tab updates.",
    language: "typescript",
    tags: ["react", "hooks", "typescript"],
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 6,
    code: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
  },
  {
    id: "2",
    title: "FastAPI CORS Middleware",
    description:
      "Standard boilerplate to allow cross-origin requests from a frontend client.",
    language: "python",
    tags: ["python", "fastapi", "backend"],
    isFavorite: false,
    createdAt: Date.now() - 86400000 * 5,
    code: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`,
  },
  {
    id: "3",
    title: "PostgreSQL Index & Join",
    description:
      "Find active users and their latest order timestamp using an index-friendly join.",
    language: "sql",
    tags: ["sql", "postgres", "database"],
    isFavorite: false,
    createdAt: Date.now() - 86400000 * 4,
    code: `SELECT u.id, u.email, MAX(o.created_at) AS last_order_date
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.status = 'ACTIVE'
GROUP BY u.id, u.email
ORDER BY last_order_date DESC NULLS LAST;`,
  },
  {
    id: "4",
    title: "Debounce Utility Function",
    description:
      "Classic debounce implementation to limit how often a function fires on rapid events.",
    language: "javascript",
    tags: ["javascript", "utility", "performance"],
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 3,
    code: `function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  fetchResults(query);
}, 500);`,
  },
  {
    id: "5",
    title: "Docker Compose – Dev Stack",
    description:
      "Quick compose file to spin up Postgres + Redis for local development.",
    language: "yaml",
    tags: ["docker", "devops", "backend"],
    isFavorite: false,
    createdAt: Date.now() - 86400000 * 2,
    code: `version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
volumes:
  pgdata:`,
  },
  {
    id: "6",
    title: "Zustand Store Pattern",
    description:
      "Lightweight global state management with Zustand — no providers needed.",
    language: "typescript",
    tags: ["react", "state", "typescript"],
    isFavorite: true,
    createdAt: Date.now() - 86400000,
    code: `import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounter = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));`,
  },
  {
    id: "7",
    title: "Bash: Find Large Files",
    description:
      "Quickly locate the top 10 largest files in a directory tree.",
    language: "bash",
    tags: ["bash", "linux", "utility"],
    isFavorite: false,
    createdAt: Date.now() - 3600000,
    code: `#!/bin/bash
# Find top 10 largest files in current dir
find . -type f -exec du -h {} + | \\
  sort -rh | \\
  head -n 10`,
  },
  {
    id: "8",
    title: "CSS Glass Card",
    description:
      "Modern glassmorphism card component with backdrop blur and subtle borders.",
    language: "css",
    tags: ["css", "ui", "design"],
    isFavorite: false,
    createdAt: Date.now() - 1800000,
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}`,
  },
];
