# Library Management API

This is a RESTful API for managing a library system, built using Node.js, Express, MongoDB, and Mongoose. It allows for managing books and borrowing operations with validation and error handling.

---

## Features

- Add, update, delete, and fetch books
- Borrow books with quantity and due date tracking
- Summary of borrowed books with aggregated quantities
- Mongoose schema validations for data integrity
- Centralized global error handling with consistent error response structure

---

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- TypeScript
- dotenv for environment variables

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or above)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Steps to run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/obidyhasan/L2-Assignment-03.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB credentials:

   ```env
   DB_USER=your_db_username
   DB_PASS=your_db_password
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. The server will run at `http://localhost:5000` by default.

---

## API Endpoints

### Books

- `POST /api/books` - Create a new book
- `GET /api/books` - Get all books (supports filtering, sorting, and pagination)
- `GET /api/books/:bookId` - Get a single book by ID
- `PUT /api/books/:bookId` - Update a book by ID
- `DELETE /api/books/:bookId` - Delete a book by ID

### Borrows

- `POST /api/borrow` - Borrow a book (reduce available copies accordingly)
- `GET /api/borrow` - Get a summary of borrowed books with total quantities

---

## Notes

- Ensure MongoDB URI is correctly set in the `.env` file.
- The application includes global error handling to catch and respond with meaningful errors.
- Data validation is implemented using Mongoose schemas.

---

## Author

Obidy Hasan Naim
