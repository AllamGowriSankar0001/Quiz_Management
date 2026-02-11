## Quiz Management Admin Client

This folder contains the **admin-facing React application** for the Quiz Management system. It allows administrators to authenticate, manage quizzes, design questions, and monitor quiz activity.

### Tech Stack

- **Framework**: React with Vite
- **Routing**: `react-router-dom`
- **UI & Styling**: Tailwind CSS and utility libraries for modern UI components
- **Form & Validation**: `react-hook-form`, `zod`

### Folder Structure

- **`index.html`**: Base HTML template used by Vite to mount the React app.
- **`src/`**:
  - `main.jsx`: Application entry point that mounts the React tree.
  - `App.jsx`: Root component that wires routes and global layout.
  - `layout.jsx`: Shared layout wrapper for admin pages (sidebar, header, content).
  - `pages/`:
    - `AdminLogin.jsx`: Admin authentication screen.
    - `Dashboard.jsx`: Overview of quiz statistics and key metrics.
    - `AllQuizes.jsx`: Listing and management of existing quizzes.
    - `QuizCreate.jsx`: Flow for creating and editing quizzes and questions.
  - `components/Sidebar.jsx`: Reusable sidebar for navigation between admin sections.
  - `index.css`: Global styles; integrates with Tailwind where applicable.
  - `assets/`: Static assets such as the React logo.
- **`public/`**: Public static assets (e.g., `logo.jpg`, `vite.svg`).
- **`vite.config.js`**: Vite configuration tailored to the admin client.
- **`eslint.config.js`**: ESLint configuration for linting and code style.
- **`components.json`**: UI/component configuration metadata used by the design system.

### Available Scripts

From the `AdminClient` folder:

- `npm install` — install all dependencies.
- `npm run dev` — start the Vite development server for the admin UI.
- `npm run build` — produce an optimized production build.
- `npm run preview` — locally preview the production build.
- `npm run lint` — run ESLint on the codebase.

This admin client is designed to work with the backend in the `server` folder and provides administrators with full control over quizzes and participants.
