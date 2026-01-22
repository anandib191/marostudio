# NextGenPhoto Backend - MERN Stack

This is the backend server for NextGenPhoto application using Node.js, Express, and MongoDB.

## Features

- Email + OTP Authentication
- MongoDB database for users and OTP storage
- JWT token-based authentication
- Admin dashboard API endpoints
- SMTP email integration for OTP delivery

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- SMTP email account (Gmail recommended)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `server` directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
PORT=8000
NODE_ENV=development

# MongoDB Connection String from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgenphoto?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30m

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace in `.env`

## Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google Account Settings](https://myaccount.google.com/)
3. Navigate to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail"
5. Use this app password as `SMTP_PASSWORD` in `.env`

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:8000` by default.

## API Endpoints

### Authentication

#### POST `/api/auth/send-otp`
Send OTP to user's email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "is_admin": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "jwt-token-here",
  "token_type": "bearer",
  "role": "user",
  "email": "user@example.com"
}
```

### Admin

#### GET `/api/admin/stats`
Get dashboard statistics (requires admin authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "totalUsers": 100,
  "totalGenerations": 500,
  "activeSubscriptions": 75,
  "revenue": 5000
}
```

#### GET `/api/admin/users`
Get paginated list of users (requires admin authentication).

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Database Models

### User
- `email` (String, unique, required)
- `role` (String: 'user' or 'admin')
- `isVerified` (Boolean)
- `createdAt` (Date)
- `lastLogin` (Date)

### OTP
- `email` (String, required)
- `otp` (String, required)
- `isAdmin` (Boolean)
- `expiresAt` (Date, auto-deletes after expiration)

### Stats
- `totalUsers` (Number)
- `totalGenerations` (Number)
- `activeSubscriptions` (Number)
- `revenue` (Number)
- `lastUpdated` (Date)

## Error Handling

All errors return a JSON response with:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security Notes

- JWT tokens expire after 30 minutes (configurable)
- OTPs expire after 10 minutes
- OTPs are automatically deleted from database after expiration
- Admin routes are protected by middleware
- CORS is configured for frontend URL only

## Troubleshooting

### MongoDB Connection Issues
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted
- Verify database user credentials

### Email Not Sending
- Check SMTP credentials
- For Gmail, ensure you're using an App Password, not your regular password
- Check firewall/network settings

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration time
- Ensure Authorization header format: `Bearer <token>`
