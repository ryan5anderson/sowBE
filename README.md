# SOW Backend API

A Node.js/Express backend API for the Statement of Work (SOW) AutoFill Proof of Concept application. This RESTful API provides authentication, user management, and notes functionality with JWT-based security.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with access and refresh tokens
- **User Management**: CRUD operations for user accounts with role-based access
- **Notes Management**: Create, read, update, and delete notes with user association
- **Security**: Password hashing with bcrypt, rate limiting, CORS protection
- **Error Handling**: Centralized error handling middleware
- **Logging**: Request logging and error event logging

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠️ Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd sowBE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3500

   # Database Configuration
   DATABASE_URI=mongodb://localhost:27017/sowpoc
   # Or for MongoDB Atlas:
   # DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/sowpoc

   # JWT Secrets (generate secure random strings)
   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   ```

   **Generate secure JWT secrets**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Run this command twice to generate both `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

## 🚀 Starting the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on port **3500** (or the port specified in your `.env` file).

**Note**: The server will wait for MongoDB to connect before starting. You should see:
- `Connected to MongoDB`
- `Server running on port 3500`

## 📁 Project Structure

```
sowBE/
├── config/              # Configuration files
│   ├── allowedOrigins.js
│   ├── corsOptions.js
│   └── dbConn.js       # MongoDB connection
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── notesController.js
│   └── usersController.js
├── middleware/          # Custom middleware
│   ├── errorHandler.js
│   ├── logger.js
│   ├── loginLimiter.js
│   └── verifyJWT.js
├── models/             # Mongoose models
│   ├── Note.js
│   └── User.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── noteRoutes.js
│   ├── root.js
│   └── userRoutes.js
├── public/             # Static files
│   └── css/
├── views/              # HTML views
│   ├── 404.html
│   └── index.html
├── .env               # Environment variables (not in git)
├── server.js          # Application entry point
└── package.json       # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth` - Login (rate limited)
- `GET /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Users (`/users`) - *Requires JWT*
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PATCH /users` - Update user
- `DELETE /users` - Delete user

### Notes (`/notes`) - *Requires JWT*
- `GET /notes` - Get all notes
- `POST /notes` - Create new note
- `PATCH /notes` - Update note
- `DELETE /notes` - Delete note

### Root
- `GET /` - Serves static files and index page

## 🔐 Authentication Flow

1. **Login**: POST credentials to `/auth` to receive access and refresh tokens
2. **Protected Routes**: Include the access token in the `Authorization` header:
   ```
   Authorization: Bearer <access_token>
   ```
3. **Token Refresh**: Use `/auth/refresh` to get a new access token when it expires
4. **Logout**: POST to `/auth/logout` to invalidate refresh token

## 🛡️ Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Tokens**: Access and refresh token pattern for secure authentication
- **Rate Limiting**: Login endpoint is rate-limited to prevent brute force attacks
- **CORS**: Configured CORS policy for allowed origins
- **Input Validation**: Express JSON parser and validation middleware

## 📦 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting middleware
- **cookie-parser** - Cookie parsing middleware

## 🐛 Troubleshooting

### Server won't start
- **Check MongoDB**: Ensure MongoDB is running locally or your MongoDB Atlas connection string is correct
- **Check Port**: Make sure port 3500 (or your configured port) is not already in use
- **Check .env**: Verify all required environment variables are set

### MongoDB Connection Issues

#### Error: `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017`

This error means MongoDB is not running or not accessible. Here are solutions:

**Option 1: Install and Start Local MongoDB**

1. **Install MongoDB Community Edition**:
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Or use Homebrew (Mac): `brew install mongodb-community`
   - Or use Chocolatey (Windows): `choco install mongodb`

2. **Start MongoDB Service**:
   - **Windows**: MongoDB usually runs as a Windows service. Start it via Services or run `mongod` in a terminal
   - **Mac/Linux**: Run `mongod` in a terminal, or start the service:
     ```bash
     brew services start mongodb-community  # Mac
     sudo systemctl start mongod            # Linux
     ```

3. **Verify MongoDB is running**:
   ```bash
   # Check if MongoDB is listening on port 27017
   netstat -an | grep 27017
   # Or try connecting with MongoDB shell
   mongosh
   ```

**Option 2: Use MongoDB Atlas (Cloud)**

1. **Create a free MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster** (free tier available)

3. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update your `.env` file**:
   ```env
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/sowpoc
   ```
   Replace `username`, `password`, and `cluster` with your actual values.

5. **Whitelist your IP address** in MongoDB Atlas Network Access settings

**Option 3: Use Docker (Alternative)**

If you have Docker installed:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Authentication Errors
- Verify `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are set in `.env`
- Check that tokens are being sent in the correct format in request headers

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `3500` |
| `DATABASE_URI` | MongoDB connection string | Yes | - |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes | - |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes | - |

## 📄 License

ISC

## 👤 Author

Statement of Work AutoFill POC
