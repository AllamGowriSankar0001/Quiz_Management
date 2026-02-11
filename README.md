## Quiz Management Monorepo

This repository contains a complete **Quiz Management system** composed of a Node.js backend and two separate React frontends for users and administrators.

### Projects

- **`server`**: Backend REST API built with Express and MongoDB (via Mongoose). It handles authentication, quiz creation and management, question storage, and quiz participation via room codes.
- **`UserClient`**: User-facing React application built with Vite. It allows end users to log in and join quizzes using codes provided by admins.
- **`AdminClient`**: Admin-facing React application built with Vite. It provides admins with tools to create quizzes, manage questions, and monitor quiz activity.

Each of these folders has its own dedicated `README.md` with more detailed documentation about structure and usage.

### Tech Stack Overview

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **Frontend**: React, Vite, React Router
- **Tooling**: ESLint, npm

### Getting Started

Clone the repository and install dependencies for each project:

```bash
git clone <your-repo-url>
cd Quiz-Management

cd server
npm install

cd ../UserClient
npm install

cd ../AdminClient
npm install
```

### Running the Applications

- **Start the backend server**

```bash
cd server
npm run dev
```

- **Start the user client**

```bash
cd UserClient
npm run dev
```

- **Start the admin client**

```bash
cd AdminClient
npm run dev
```

Refer to the per-project READMEs in `server`, `UserClient`, and `AdminClient` for environment variables, build commands, and additional details.


