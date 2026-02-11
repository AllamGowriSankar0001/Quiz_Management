## Quiz Management User Client

This folder contains the **user-facing React application** for the Quiz Management system. It allows end users to authenticate, join quizzes using room codes, and interact with quiz content in the browser.

### Tech Stack

- **Framework**: React with Vite
- **Routing**: `react-router-dom`
- **Build Tooling**: Vite, ESLint

### Folder Structure

- **`index.html`**: Base HTML shell used by Vite to mount the React app.
- **`src/`**:
  - `main.jsx`: React entry file that mounts the root component into the DOM.
  - `App.jsx`: Top-level application component that wires up routing and shared layout.
  - `pages/UserLogin.jsx`: Screen for user authentication and access to quizzes.
  - `index.css`: Global styles for the user-facing UI.
  - `assets/`: Static assets such as the React logo.
- **`public/`**: Public static assets served as-is (e.g., `logo.jpg`, `vite.svg`).
- **`vite.config.js`**: Vite configuration for the React build.
- **`eslint.config.js`**: ESLint configuration for code quality and consistency.

### Available Scripts

From the `UserClient` folder:

- `npm install` — install all dependencies.
- `npm run dev` — start the Vite development server with hot reloading.
- `npm run build` — create an optimized production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — run ESLint checks across the source code.

This client consumes APIs exposed by the backend in the `server` folder to provide a seamless quiz experience for end users.
