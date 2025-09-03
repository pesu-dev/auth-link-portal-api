# IMPORTANT

This API is now offline. A fix for the auth-link-portal has been implemented, therefore this API is no longer needed.

# PESU API Server

A Node.js Express server with MongoDB for managing student records and link records.

## Features

- **checkPrnExists**: Check if a PRN exists in the link records
- **studentRecordCreateOrUpdate**: Create or update student records
- **linkRecordCreate**: Create link records between users and PRNs

## API Endpoints

All endpoints require authentication with `Bearer banana` token in the Authorization header.

### GET /api/check-prn/:prn
Check if a PRN exists in the link records.

**Response:**
```json
{
  "success": true,
  "data": {
    "prn": "PES1UG20CS123",
    "exists": true
  }
}
```

### POST /api/student
Create or update a student record.

**Request Body:**
```json
{
  "prn": "PES1UG20CS123",
  "branch": {
    "full": "Computer Science and Engineering",
    "short": "CSE"
  },
  "year": "2020",
  "campus": {
    "code": 1,
    "short": "RR"
  }
}
```

### POST /api/link
Create a link record between a user and PRN.

**Request Body:**
```json
{
  "userId": "user123",
  "prn": "PES1UG20CS123"
}
```

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Update the MongoDB connection string in `.env` file

3. Start the server:
   ```bash
   yarn dev
   ```

The server will run on port 3000 by default.

## Authentication

All API endpoints require the following header:
```
Authorization: Bearer banana
```
