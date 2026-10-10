export type CodeThemeId =
  | "tokyo-night"
  | "one-dark"
  | "dracula"
  | "monokai"
  | "github-dark"
  | "github-light";

export interface CodeTheme {
  id: CodeThemeId;
  name: string;
  previewColors: [string, string, string];
  bg: string;
}

export const CODE_THEMES: CodeTheme[] = [
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    previewColors: ["#bb9af7", "#7aa2f7", "#9ece6a"],
    bg: "#16161e",
  },
  {
    id: "github-light",
    name: "GitHub Light",
    previewColors: ["#cf222e", "#0969da", "#1a7f37"],
    bg: "#f6f8fa",
  },
  {
    id: "one-dark",
    name: "One Dark",
    previewColors: ["#c678dd", "#61afef", "#98c379"],
    bg: "#1a1a22",
  },
  {
    id: "dracula",
    name: "Dracula",
    previewColors: ["#ff79c6", "#bd93f9", "#50fa7b"],
    bg: "#1e1f29",
  },
  {
    id: "monokai",
    name: "Monokai",
    previewColors: ["#f92672", "#a6e22e", "#66d9ef"],
    bg: "#1e1f1c",
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    previewColors: ["#ff7b72", "#79c0ff", "#7ee787"],
    bg: "#0d1117",
  },
];
