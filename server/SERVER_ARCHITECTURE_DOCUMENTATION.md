# Quiz Management Server - Complete Architecture Documentation

## Overview
This is a Node.js/Express.js backend server for a Quiz Management System. The server provides RESTful APIs for admin quiz management and user quiz participation. It uses MongoDB with Mongoose for data persistence, JWT for authentication, and follows a modular MVC architecture.

---

## Table of Contents
1. [Server Entry Point (server.js)](#server-entry-point-serverjs)
2. [Project Structure](#project-structure)
3. [Dependencies & Technologies](#dependencies--technologies)
4. [Database Models](#database-models)
5. [API Routes & Endpoints](#api-routes--endpoints)
6. [Controllers & Business Logic](#controllers--business-logic)
7. [Middleware](#middleware)
8. [Configuration](#configuration)
9. [Authentication Flow](#authentication-flow)
10. [Data Flow & Workflows](#data-flow--workflows)

---

## Server Entry Point (server.js)

### File Location
`server.js` (root directory)

### Complete Code Structure
```javascript
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./Config/ConnectDB');
const createAdmin = require('./Scripts/AdminCreate');
const AdminRoutes = require("./Routes/AdminRoutes");
const UserRoutes = require("./Routes/UserRoutes")
const app = express();
const PORT = process.env.PORT;

connectDB();
// createAdmin();

app.use(cors());
app.use(express.json());

app.get("/check",(req,res)=>{
    res.status(200).json({message:"The Backend is running perfectly"})
})
app.use("/admin",AdminRoutes);
app.use("/user",UserRoutes);

app.listen(PORT,()=>{
  console.log(`Server running at http://localhost:${PORT}`);
})
```

### Detailed Breakdown

#### 1. **Imports & Dependencies**
- **express**: Web framework for Node.js, creates the Express application instance
- **dotenv**: Loads environment variables from `.env` file
- **cors**: Enables Cross-Origin Resource Sharing (CORS) for frontend-backend communication
- **connectDB**: Custom module that establishes MongoDB connection
- **createAdmin**: Script to create default admin user (currently commented out)
- **AdminRoutes**: Router module for all admin-related endpoints
- **UserRoutes**: Router module for all user-related endpoints

#### 2. **Application Initialization**
- Creates Express app instance: `const app = express()`
- Reads PORT from environment variables: `process.env.PORT`
- Must have `.env` file with `PORT` and `MONGODBURL` defined

#### 3. **Database Connection**
- `connectDB()`: Called immediately to establish MongoDB connection before server starts
- Connection is asynchronous but not awaited (runs in background)

#### 4. **Middleware Configuration**
- **`app.use(cors())`**: 
  - Allows all origins (no restrictions)
  - Enables preflight requests
  - Allows credentials if needed
- **`app.use(express.json())`**: 
  - Parses incoming JSON request bodies
  - Makes `req.body` available in route handlers
  - Handles Content-Type: application/json

#### 5. **Routes**

##### Health Check Endpoint
- **Path**: `GET /check`
- **Purpose**: Server health/status check
- **Response**: 
  ```json
  {
    "message": "The Backend is running perfectly"
  }
  ```
- **Status Code**: 200
- **Authentication**: None required

##### Admin Routes
- **Base Path**: `/admin`
- **Mounted Routes**: All routes from `AdminRoutes.js` are prefixed with `/admin`
- **Example**: Route defined as `/login` in AdminRoutes becomes `/admin/login`

##### User Routes
- **Base Path**: `/user`
- **Mounted Routes**: All routes from `UserRoutes.js` are prefixed with `/user`
- **Example**: Route defined as `/startquiz` in UserRoutes becomes `/user/startquiz`

#### 6. **Server Startup**
- `app.listen(PORT, callback)`: Starts HTTP server on specified port
- Logs server URL to console when ready

---

## Project Structure

```
server/
├── server.js                 # Main entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in repo)
├── Config/
│   └── ConnectDB.js         # MongoDB connection configuration
├── Controllers/
│   ├── AdminController.js   # Admin business logic
│   └── userControllers.js   # User business logic
├── Middleware/
│   └── verifyToken.js       # JWT authentication middleware
├── Models/
│   ├── AdminModel.js        # Admin schema
│   ├── quizModel.js         # Quiz schema
│   ├── questionModel.js     # Question schema
│   ├── AttendQuiz.js        # Quiz attempt schema
│   └── userModel.js         # User schema (defined but not actively used)
├── Routes/
│   ├── AdminRoutes.js       # Admin route definitions
│   └── UserRoutes.js        # User route definitions
└── Scripts/
    └── AdminCreate.js       # Admin user creation script
```

---

## Dependencies & Technologies

### Core Dependencies (from package.json)
1. **express** (^5.2.1): Web framework
2. **mongoose** (^9.1.5): MongoDB ODM (Object Document Mapper)
3. **dotenv** (^17.2.3): Environment variable management
4. **cors** (^2.8.6): Cross-Origin Resource Sharing
5. **jsonwebtoken** (^9.0.3): JWT token generation and verification
6. **bcrypt** (^6.0.0): Password hashing

### Development Dependencies
- **nodemon** (^3.1.11): Auto-restart server on file changes

### Environment Variables Required
```env
PORT=3000                    # Server port number
MONGODBURL=mongodb://...     # MongoDB connection string
JWTSECRETKEY=your_secret     # Secret key for JWT signing
```

---

## Database Models

### 1. Admin Model (`Models/AdminModel.js`)
**Collection Name**: `admins`

**Schema**:
```javascript
{
  email: String (unique, required),
  password: String (hashed with bcrypt),
  role: String (enum: ["Admin"])
}
```

**Purpose**: Stores admin credentials for authentication
**Indexes**: `email` is unique

---

### 2. Quiz Model (`Models/quizModel.js`)
**Collection Name**: `quizzes`

**Schema**:
```javascript
{
  sessionCode: String (required, unique),  // Unique identifier for quiz session
  quizName: String (required),              // Display name of quiz
  numberOfQuestions: Number (required),     // Total questions in quiz
  isActive: Boolean (default: true),       // Whether quiz is currently active
  createdAt: Date (auto),                   // Timestamp
  updatedAt: Date (auto)                    // Timestamp
}
```

**Purpose**: Represents a quiz session that users can join
**Key Field**: `sessionCode` - used to identify and join quizzes
**Relationships**: 
- One-to-many with Questions (via sessionCode)
- One-to-many with Attempts (via sessionCode)

---

### 3. Question Model (`Models/questionModel.js`)
**Collection Name**: `questions`

**Schema**:
```javascript
{
  sessionCode: String (required),          // Links to Quiz
  questionText: String (required),         // The question itself
  options: [                                // Array of answer options
    {
      text: String,                        // Option text
      isCorrect: Boolean                   // Whether this option is correct
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Purpose**: Stores individual quiz questions with multiple-choice options
**Relationships**: 
- Many-to-one with Quiz (via sessionCode)
- Referenced by Attempt answers (via questionId)

**Security Note**: `isCorrect` field is excluded when sending questions to users

---

### 4. Attempt Model (`Models/AttendQuiz.js`)
**Collection Name**: `attempts`

**Schema**:
```javascript
{
  sessionCode: String (required),
  name: String (required),                 // User's name
  email: String (required),                // User's email
  status: String (enum: ["IN_PROGRESS", "SUBMITTED"], default: "IN_PROGRESS"),
  answers: [                               // User's selected answers
    {
      questionId: ObjectId (ref: "Questions"),
      selectedOption: String               // The option text user selected
    }
  ],
  score: Number,                           // Calculated score after submission
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Purpose**: Tracks user quiz attempts and submissions
**Indexes**: Compound unique index on `(sessionCode, email)` - prevents duplicate attempts
**Relationships**: 
- Many-to-one with Quiz (via sessionCode)
- References Questions (via questionId in answers)

---

### 5. User Model (`Models/userModel.js`)
**Collection Name**: `users`

**Schema**:
```javascript
{
  name: String,
  email: String (unique),
  role: String (default: "USER")
}
```

**Purpose**: Defined but not actively used in current implementation
**Note**: User data is stored in Attempt model instead

---

## API Routes & Endpoints

### Admin Routes (`/admin`)

#### 1. Admin Login
- **Method**: `POST`
- **Path**: `/admin/login`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "email": "admin@gmail.com",
    "password": "ADMINPASSWORD"
  }
  ```
- **Success Response** (202):
  ```json
  {
    "message": "Admin Logged-In",
    "YOUR_TOKEN": "jwt_token_here"
  }
  ```
- **Error Responses**:
  - 400: Missing fields, invalid credentials, or email not found
- **Controller**: `AdminController.AdminLogin`

---

#### 2. Create Quiz
- **Method**: `POST`
- **Path**: `/admin/createquiz`
- **Authentication**: Required (JWT token in Authorization header)
- **Request Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Request Body**:
  ```json
  {
    "sessionCode": "QUIZ123",
    "quizName": "JavaScript Basics",
    "numberOfQuestions": 10
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "QUiz Created",
    "QuizData": {
      "_id": "...",
      "sessionCode": "QUIZ123",
      "quizName": "JavaScript Basics",
      "numberOfQuestions": 10,
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```
- **Error Responses**:
  - 400: Missing fields or creation failure
  - 401: No token or invalid token
- **Controller**: `AdminController.QuizCreate`

---

#### 3. Add Questions to Quiz
- **Method**: `POST`
- **Path**: `/admin/addquestions`
- **Authentication**: Required (JWT token)
- **Request Headers**:
  ```
  Authorization: Bearer <jwt_token>
  ```
- **Request Body**:
  ```json
  {
    "sessionCode": "QUIZ123",
    "questionsList": [
      {
        "questionText": "What is JavaScript?",
        "options": [
          { "text": "A programming language", "isCorrect": true },
          { "text": "A database", "isCorrect": false },
          { "text": "A framework", "isCorrect": false },
          { "text": "A browser", "isCorrect": false }
        ]
      },
      {
        "questionText": "What is Node.js?",
        "options": [
          { "text": "A JavaScript runtime", "isCorrect": true },
          { "text": "A database", "isCorrect": false }
        ]
      }
    ]
  }
  ```
- **Success Response** (201):
  ```json
  {
    "message": "Questions added successfully",
    "quizData": [
      {
        "_id": "...",
        "sessionCode": "QUIZ123",
        "questionText": "...",
        "options": [...]
      }
    ]
  }
  ```
- **Error Responses**:
  - 400: Missing fields or insertion failure
  - 404: Quiz not found
  - 401: No token or invalid token
- **Controller**: `AdminController.QuestionsCreate`
- **Note**: Returns all questions for the sessionCode after insertion

---

### User Routes (`/user`)

#### 1. Start Quiz Attempt
- **Method**: `POST`
- **Path**: `/user/startquiz`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "sessionCode": "QUIZ123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "quizName": "JavaScript Basics",
    "sessionCode": "QUIZ123",
    "attemptId": "attempt_object_id",
    "questions": [
      {
        "_id": "...",
        "sessionCode": "QUIZ123",
        "questionText": "What is JavaScript?",
        "options": [
          { "text": "A programming language", "isCorrect": undefined },
          { "text": "A database", "isCorrect": undefined }
        ]
      }
    ]
  }
  ```
- **Error Responses**:
  - 401: Missing required fields
  - 404: Invalid session code or quiz not active
  - 403: User already attended this quiz
  - 500: Server error
- **Controller**: `userControllers.StartAttempt`
- **Security**: `isCorrect` field is excluded from response

---

#### 2. Submit Quiz
- **Method**: `POST`
- **Path**: `/user/submitquiz`
- **Authentication**: None required
- **Request Body**:
  ```json
  {
    "sessionCode": "QUIZ123",
    "email": "john@example.com",
    "answers": [
      {
        "questionId": "question_object_id",
        "selectedOption": "A programming language"
      },
      {
        "questionId": "another_question_id",
        "selectedOption": "A JavaScript runtime"
      }
    ]
  }
  ```
- **Success Response** (200):
  ```json
  {
    "message": "Quiz submitted successfully",
    "answers": [
      {
        "questionId": "...",
        "selectedOption": "..."
      }
    ]
  }
  ```
- **Error Responses**:
  - 400: Missing required fields
  - 404: Invalid session code, quiz not active, or no active attempt found
  - 500: Server error
- **Controller**: `userControllers.SubmitQuiz`
- **Logic**: 
  - Validates answers against correct options
  - Calculates score (1 point per correct answer)
  - Updates attempt status to "SUBMITTED"
  - Saves score and answers

---

## Controllers & Business Logic

### AdminController (`Controllers/AdminController.js`)

#### AdminLogin Function
**Purpose**: Authenticate admin user and issue JWT token

**Process**:
1. Validates email and password are provided
2. Finds admin by email in database
3. Compares provided password with hashed password using bcrypt
4. If valid, generates JWT token with:
   - Payload: `{ email, role }`
   - Secret: `process.env.JWTSECRETKEY`
   - Expiration: 1 day
5. Returns token to client

**Error Handling**:
- Missing fields → 400
- Email not found → 400
- Invalid password → 400 (but returns 200 with error message - potential bug)
- Server errors → 400 with error details

---

#### QuizCreate Function
**Purpose**: Create a new quiz session

**Process**:
1. Validates sessionCode, quizName, and numberOfQuestions
2. Creates new Quiz document in database
3. Returns created quiz data

**Error Handling**:
- Missing fields → 400
- Creation failure → 400
- Server errors → 400 with error details

**Note**: Quiz is created with `isActive: true` by default

---

#### QuestionsCreate Function
**Purpose**: Add multiple questions to an existing quiz

**Process**:
1. Validates sessionCode and questionsList
2. Verifies quiz exists with given sessionCode
3. Maps questionsList to Question schema format
4. Inserts all questions using `insertMany()`
5. Fetches all questions for the sessionCode
6. Returns all questions (including newly added)

**Error Handling**:
- Missing fields → 400
- Quiz not found → 404
- Insertion failure → 400
- Server errors → 400 with error details

**Data Transformation**:
```javascript
// Input format
questionsList: [
  { questionText: "...", options: [...] }
]

// Stored format
{
  sessionCode: "...",
  questionText: "...",
  options: [...]
}
```

---

### UserControllers (`Controllers/userControllers.js`)

#### StartAttempt Function
**Purpose**: Initialize a quiz attempt and return questions

**Process**:
1. Validates name, email, and sessionCode
2. Finds quiz by sessionCode where `isActive: true`
3. Checks if user (email) already attempted this quiz
4. Creates new Attempt document with status "IN_PROGRESS"
5. Fetches all questions for sessionCode
6. Excludes `isCorrect` field from options (security)
7. Returns quiz info, attemptId, and questions

**Error Handling**:
- Missing fields → 401
- Quiz not found or inactive → 404
- Duplicate attempt → 403
- Server errors → 500

**Security Features**:
- Prevents duplicate attempts per email per session
- Hides correct answers from users
- Only allows attempts on active quizzes

---

#### SubmitQuiz Function
**Purpose**: Submit quiz answers and calculate score

**Process**:
1. Validates sessionCode, email, and answers array
2. Verifies quiz exists and is active
3. Finds attempt with status "IN_PROGRESS"
4. For each answer:
   - Finds question by questionId
   - Checks if selectedOption matches any option where `isCorrect: true`
   - Increments score if correct
5. Updates attempt:
   - Sets answers array
   - Sets status to "SUBMITTED"
   - Sets calculated score
6. Saves attempt and returns success

**Error Handling**:
- Missing fields → 400
- Quiz not found or inactive → 404
- No active attempt → 404
- Server errors → 500

**Scoring Logic**:
- 1 point per correct answer
- Total score = number of correct answers
- Score is stored as Number in attempt document

---

## Middleware

### verifyToken (`Middleware/verifyToken.js`)

**Purpose**: Authenticate JWT tokens for protected routes

**Process**:
1. Extracts token from `Authorization` header
2. Expected format: `Bearer <token>`
3. Splits header to get token (after "Bearer ")
4. Verifies token using `JWT.verify()` with `process.env.JWTSECRETKEY`
5. Attaches decoded token to `req.user`
6. Calls `next()` to continue to route handler

**Error Handling**:
- No Authorization header → 401
- Invalid token format → 401
- Invalid/expired token → 500 (should be 401 - potential bug)
- Server errors → 500

**Usage**: Applied to admin routes that require authentication:
- `/admin/createquiz`
- `/admin/addquestions`

**Token Payload Structure**:
```javascript
{
  email: "admin@gmail.com",
  role: "Admin",
  iat: <issued_at_timestamp>,
  exp: <expiration_timestamp>
}
```

---

## Configuration

### Database Connection (`Config/ConnectDB.js`)

**Purpose**: Establish MongoDB connection using Mongoose

**Implementation**:
```javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODBURL);
    console.log("MongoDB Connected");
    console.log(`Database Name: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};
```

**Features**:
- Uses connection string from environment variable
- Logs connection status and database name
- Error handling for connection failures
- Async/await pattern

**Connection Options**: Uses default Mongoose connection options

---

### Admin Creation Script (`Scripts/AdminCreate.js`)

**Purpose**: Create default admin user (one-time setup)

**Default Credentials**:
- Email: `secret`
- Password: `secret`
- Role: `Admin`

**Process**:
1. Checks if admin with email already exists
2. Hashes password with bcrypt (salt rounds: 10)
3. Creates admin document
4. Logs success or failure

**Usage**: 
- Currently commented out in `server.js`
- Can be uncommented for initial setup
- Should be disabled after first admin is created

**Security Note**: Default password should be changed after first login

---

## Authentication Flow

### Admin Authentication

1. **Login Request**:
   ```
   POST /admin/login
   Body: { email, password }
   ```

2. **Server Validation**:
   - Checks email exists in Admin collection
   - Compares password with bcrypt hash

3. **Token Generation**:
   - Creates JWT with email and role
   - Sets 1-day expiration

4. **Token Usage**:
   ```
   Authorization: Bearer <token>
   ```

5. **Token Verification**:
   - `verifyToken` middleware extracts and validates token
   - Attaches user info to `req.user`
   - Route handler can access `req.user.email` and `req.user.role`

### User Authentication
- **None**: Users don't authenticate
- Identification via email in request body
- Duplicate prevention via unique index on (sessionCode, email)

---

## Data Flow & Workflows

### Workflow 1: Admin Creates Quiz

```
1. Admin logs in → POST /admin/login
   ↓
2. Receives JWT token
   ↓
3. Creates quiz → POST /admin/createquiz (with token)
   ↓
4. Receives sessionCode
   ↓
5. Adds questions → POST /admin/addquestions (with token)
   ↓
6. Quiz is ready (isActive: true)
```

### Workflow 2: User Takes Quiz

```
1. User starts quiz → POST /user/startquiz
   Body: { name, email, sessionCode }
   ↓
2. Server validates quiz exists and is active
   ↓
3. Server checks for duplicate attempt
   ↓
4. Server creates Attempt (status: IN_PROGRESS)
   ↓
5. Server returns questions (without isCorrect)
   ↓
6. User answers questions
   ↓
7. User submits → POST /user/submitquiz
   Body: { sessionCode, email, answers }
   ↓
8. Server validates attempt exists
   ↓
9. Server calculates score
   ↓
10. Server updates Attempt (status: SUBMITTED, score)
   ↓
11. Server returns success
```

### Data Relationships

```
Quiz (1) ──→ (Many) Questions
  │
  └──→ (Many) Attempts

Question (1) ──→ (Many) Attempt.answers[].questionId

Attempt (Many) ──→ (1) Quiz (via sessionCode)
```

---

## Security Considerations

### Implemented
1. **Password Hashing**: Admin passwords hashed with bcrypt
2. **JWT Authentication**: Protected admin routes
3. **Answer Hiding**: `isCorrect` excluded from user responses
4. **Duplicate Prevention**: Unique index prevents multiple attempts
5. **Active Quiz Check**: Only active quizzes can be attempted

### Potential Improvements
1. **Token Expiration**: Currently 1 day - could be shorter
2. **Error Messages**: Some error messages might leak information
3. **Rate Limiting**: No rate limiting on endpoints
4. **Input Validation**: Limited validation on request bodies
5. **CORS Configuration**: Currently allows all origins
6. **Password Policy**: No password strength requirements
7. **Token Refresh**: No refresh token mechanism
8. **HTTPS**: Should enforce HTTPS in production

---

## Error Handling Patterns

### Common Error Responses

**400 Bad Request**:
- Missing required fields
- Validation failures
- Business logic errors

**401 Unauthorized**:
- Missing authentication token
- Invalid credentials

**403 Forbidden**:
- Duplicate attempt
- Insufficient permissions

**404 Not Found**:
- Resource doesn't exist
- Invalid session code

**500 Internal Server Error**:
- Database errors
- Unexpected exceptions

---

## Environment Setup

### Required Environment Variables
```env
PORT=3000
MONGODBURL=mongodb://localhost:27017/quiz-management
JWTSECRETKEY=your_super_secret_jwt_key_here
```

### Installation Steps
```bash
npm install
# Create .env file with above variables
npm start  # or npm run dev for development
```

---

## API Summary Table

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | /check | No | Health check |
| POST | /admin/login | No | Admin authentication |
| POST | /admin/createquiz | Yes (JWT) | Create quiz session |
| POST | /admin/addquestions | Yes (JWT) | Add questions to quiz |
| POST | /user/startquiz | No | Start quiz attempt |
| POST | /user/submitquiz | No | Submit quiz answers |

---

## Design Patterns Used

1. **MVC Architecture**: Separation of routes, controllers, and models
2. **Middleware Pattern**: Authentication middleware for route protection
3. **Router Pattern**: Modular route definitions
4. **Schema Pattern**: Mongoose schemas for data validation
5. **Environment Configuration**: dotenv for configuration management

---

## Notes for ChatGPT/Design Analysis

### Key Design Decisions
1. **Session-Based Quizzes**: Uses `sessionCode` as unique identifier instead of quiz ID
2. **No User Registration**: Users identified only by email during attempt
3. **Two-Phase Quiz Creation**: Quiz created first, then questions added separately
4. **Attempt Tracking**: Separate Attempt model tracks user progress
5. **Score Calculation**: Server-side scoring prevents client manipulation

### Current Limitations
1. No quiz editing or deletion
2. No question editing or deletion
3. No quiz deactivation endpoint
4. No results viewing endpoint
5. No admin management (CRUD)
6. User model defined but unused
7. No pagination for questions
8. No time limits for quizzes
9. No question ordering control

### Potential Enhancements
1. Quiz management (edit, delete, deactivate)
2. Question management (edit, delete, reorder)
3. Results dashboard for admins
4. User registration and profiles
5. Quiz analytics and statistics
6. Time limits and auto-submit
7. Question types (multiple choice, true/false, etc.)
8. Image support for questions
9. Quiz categories and tags
10. Export results to CSV/PDF

---

## Conclusion

This server implements a basic but functional quiz management system with:
- Admin authentication and quiz creation
- User quiz participation
- Answer validation and scoring
- Attempt tracking and duplicate prevention

The architecture is modular and follows RESTful principles, making it easy to extend with additional features.

