# 📖 Library Management API with Express, TypeScript & MongoDB

A robust Library Management System API built with **Express.js**, **TypeScript**, and **MongoDB** using **Mongoose**.

## ✨ Features

- **📚 Complete Book Management**: CRUD operations for books with validation
- **🔄 Book Borrowing System**: Intelligent borrowing with availability tracking
- **🔍 Advanced Filtering & Sorting**: Filter by genre, sort by various fields
- **📊 Aggregation Pipeline**: Borrowed books summary using MongoDB aggregation
- **🛡️ Data Validation**: Comprehensive input validation and error handling
- **⚡ Performance Optimized**: Database indexing and efficient queries
- **🔒 Security Features**: Rate limiting, CORS, and security headers
- **📝 TypeScript**: Full type safety and IntelliSense support

## 🏗️ Architecture

- **Express.js**: Fast, unopinionated web framework
- **TypeScript**: Static typing and modern JavaScript features
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling with validation
- **Middleware**: Error handling, validation, and security

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd library-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/library_management
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

6. **Test the API**
   ```bash
   # Health check
   curl http://localhost:5000/health
   ```

## 📚 API Endpoints

### Books Management

#### 1. Create Book
```http
POST /api/books
Content-Type: application/json

{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

#### 2. Get All Books
```http
GET /api/books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5
```

**Query Parameters:**
- `filter`: Filter by genre (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
- `sortBy`: Sort field (default: createdAt)
- `sort`: Sort order (asc/desc, default: desc)
- `limit`: Number of results (default: 10)

#### 3. Get Book by ID
```http
GET /api/books/:bookId
```

#### 4. Update Book
```http
PUT /api/books/:bookId
Content-Type: application/json

{
  "copies": 50
}
```

#### 5. Delete Book
```http
DELETE /api/books/:bookId
```

### Borrowing System

#### 6. Borrow a Book
```http
POST /api/borrow
Content-Type: application/json

{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### 7. Get Borrowed Books Summary
```http
GET /api/borrow
```

Returns aggregated data showing total borrowed quantity per book.

## 🎯 Core Requirements Met

### ✅ Schema Validation
- Comprehensive field validation for all models
- Custom validators for ISBN, dates, and quantities
- Enum validation for book genres

### ✅ Business Logic Enforcement
- Availability control on book borrowing
- Automatic availability updates when copies change
- Quantity validation before borrowing

### ✅ Aggregation Pipeline
- Borrowed books summary using MongoDB aggregation
- Group by book, sum quantities, and lookup book details

### ✅ Mongoose Static/Instance Methods
- **Static**: `updateAvailability()` - Updates book availability
- **Instance**: `canBeBorrowed()`, `borrowCopies()`, `returnCopies()`

### ✅ Mongoose Middleware
- **Pre-save**: Validates book existence and updates availability
- **Post-save**: Logs operations for debugging

### ✅ Filtering Features
- Genre-based filtering
- Sorting by multiple fields
- Pagination with configurable limits

## 🛠️ Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── middleware/
│   └── errorHandler.ts      # Error handling middleware
├── models/
│   ├── Book.ts             # Book model with methods
│   └── Borrow.ts           # Borrow model
├── routes/
│   ├── bookRoutes.ts       # Book CRUD operations
│   └── borrowRoutes.ts     # Borrowing operations
└── index.ts                # Main application entry
```

## 🔧 Development

### Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests
```

### TypeScript Configuration
- Strict mode enabled
- ES2020 target
- Source maps for debugging
- Declaration files generation

## 🧪 Testing

The API can be tested using:

- **Postman**: Import the endpoints
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing tool

### Example Test Data
```json
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "FICTION",
  "isbn": "9780451524935",
  "description": "A dystopian social science fiction novel.",
  "copies": 10
}
```

## 🚀 Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management
PORT=5000
NODE_ENV=production
```

### Build & Deploy
```bash
npm run build
npm start
```

## 📊 Database Schema

### Book Collection
```typescript
{
  title: string,           // Required, max 200 chars
  author: string,          // Required, max 100 chars
  genre: BookGenre,        // Required, enum values
  isbn: string,            // Required, unique, 10-13 digits
  description?: string,    // Optional, max 1000 chars
  copies: number,          // Required, non-negative integer
  available: boolean,      // Auto-managed based on copies
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-updated
}
```

### Borrow Collection
```typescript
{
  book: ObjectId,          // Required, references Book
  quantity: number,        // Required, positive integer
  dueDate: Date,           // Required, future date
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-updated
}
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses

## 📈 Performance Features

- **Database Indexing**: Optimized queries
- **Aggregation Pipeline**: Efficient data processing
- **Connection Pooling**: MongoDB connection management
- **Response Caching**: Built-in caching strategies



