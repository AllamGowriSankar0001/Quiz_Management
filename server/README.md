## Quiz Management Server

This folder contains the **backend API** for the Quiz Management system. It is responsible for user and admin authentication, quiz lifecycle management, question storage, and quiz participation via room codes.

### Tech Stack

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JSON Web Tokens (JWT) and bcrypt for password hashing
- **Environment**: Configured via `dotenv`

### Folder Structure

- **`server.js`**: Entry point that configures Express, middleware, database connection, and route mounting.
- **`Config/ConnectDB.js`**: Centralized MongoDB connection logic using Mongoose.
- **`Controllers/`**:
  - `AdminController.js`: Handles admin flows such as login, dashboard statistics, quiz management, and admin-side quiz operations.
  - `userControllers.js`: Handles user-facing operations such as joining quizzes, submitting answers, and retrieving quiz data.
- **`Routes/`**:
  - `AdminRoutes.js`: Express router for admin endpoints.
  - `UserRoutes.js`: Express router for user-facing endpoints.
- **`Models/`**:
  - `AdminModel.js`, `userModel.js`: User and admin schema definitions and persistence logic.
  - `quizModel.js`, `questionModel.js`, `AttendQuiz.js`: Quiz, question, and participation schemas.
- **`Middleware/verifyToken.js`**: JWT-based authorization middleware to protect secured routes.
- **`Scripts/AdminCreate.js`**: Utility script to bootstrap or manage admin users.
- **`SERVER_ARCHITECTURE_DOCUMENTATION.md`**: In-depth architecture document describing flows, endpoints, and design decisions.

### Running the Server

- **Install dependencies**
  - From this folder, run: `npm install`
- **Start in development**
  - `npm run dev` (runs the server with `nodemon` for auto-reload)
- **Start in production**
  - `npm start`

By default, the server exposes REST APIs that are consumed by the **UserClient** and **AdminClient** applications in this repository.


