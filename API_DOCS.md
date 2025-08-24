# 📚 Library Management API Documentation

## 🚀 Getting Started

**Base URL**: `http://localhost:5000/api`

**Health Check**: `GET /health`

## 📖 Books API

### 1. Create Book
**POST** `/books`

**Request Body:**
```json
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

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

### 2. Get All Books
**GET** `/books`

**Query Parameters:**
- `filter`: Genre filter (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
- `sortBy`: Sort field (default: createdAt)
- `sort`: Sort order (asc/desc, default: desc)
- `limit`: Number of results (default: 10)

**Example:**
```
GET /books?filter=SCIENCE&sortBy=createdAt&sort=desc&limit=5
```

### 3. Get Book by ID
**GET** `/books/:bookId`

### 4. Update Book
**PUT** `/books/:bookId`

### 5. Delete Book
**DELETE** `/books/:bookId`

## 🔄 Borrowing API

### 6. Borrow a Book
**POST** `/borrow`

**Request Body:**
```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

### 7. Get Borrowed Books Summary
**GET** `/borrow`

**Response:**
```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}
```

## 🎯 Features Implemented

✅ **Schema Validation** - Comprehensive field validation  
✅ **Business Logic** - Availability control on borrowing  
✅ **Aggregation Pipeline** - Borrowed books summary  
✅ **Static/Instance Methods** - Book availability management  
✅ **Mongoose Middleware** - Pre/post save hooks  
✅ **Filtering** - Genre-based filtering and sorting  

## 🚫 Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "details": "Additional error information"
  }
}
```

## 🧪 Testing

Use Postman, cURL, or any API testing tool to test the endpoints.
