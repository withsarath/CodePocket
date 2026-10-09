# 📦 CodePocket

**Your personal pocket for reusable code snippets.**

CodePocket is a lightweight, browser-based code snippet manager built with React and TypeScript. It helps developers organize, search, favorite, and manage reusable code snippets in one place, with syntax highlighting and customizable code themes.

## ✨ Features

- **Create Snippets** — Save code snippets with titles, descriptions, programming languages, and tags.
- **Edit Snippets** — Update existing snippets whenever you need to make changes.
- **Delete Snippets** — Remove snippets you no longer need.
- **Search Snippets** — Find snippets by title, description, or tags.
- **Tag Filtering** — Organize and filter snippets using tags.
- **Favorites** — Mark important snippets as favorites and filter them separately.
- **Syntax Highlighting** — Display code with syntax highlighting using highlight.js.
- **Copy to Clipboard** — Copy code snippets with a single click.
- **Custom Code Themes** — Choose from six code highlighting themes.
- **Dark & Light Mode** — Switch between interface themes.
- **Persistent Storage** — Keep snippets and preferences saved in your browser using LocalStorage.
- **Responsive Interface** — Use the application across different screen sizes.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| TypeScript | Type safety and maintainable code |
| Vite | Development server and build tooling |
| CSS | Styling and responsive layouts |
| highlight.js | Code syntax highlighting |
| LocalStorage | Client-side data persistence |

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd CodePocket
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open the local URL displayed in your terminal.

### Build for Production

Build the application for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## 📂 Project Structure

```text
CodePocket/
├── public/
├── src/
│   ├── components/
│   │   ├── AddSnippetModal
│   │   ├── SnippetCard
│   │   ├── SearchBar
│   │   ├── TagFilter
│   │   ├── CodeThemeSelector
│   │   └── ThemeToggle
│   ├── hooks/
│   │   └── useLocalStorage
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

*Note: The structure above is illustrative. Adjust the folder and file names to match your actual repository.*

## 💾 Data Storage

CodePocket uses the browser's LocalStorage to persist snippets and user preferences.

- Data remains available after refreshing the page.
- Snippets are stored locally in the current browser.
- Data is not automatically synchronized across devices.
- Clearing the browser's site data may remove saved snippets.

## 🧠 What I Learned

- Building reusable and modular React components.
- Managing application state with React Hooks.
- Creating reusable custom hooks with TypeScript generics.
- Implementing search, filtering, and favorites functionality.
- Working with browser storage and the Clipboard API.
- Integrating syntax highlighting into a React application.
- Organizing a frontend project for maintainability.


## 👨‍💻 Author

**Sarath**

- GitHub: [@withsarath](https://github.com/withsarath)
- Portfolio: [withsarath.vercel.app](https://withsarath.vercel.app/)

---

*Built with ❤️ to make reusable code easier to organize and access.*
