# BookStore - Buy & Sell Books

A full-stack MERN application where users can buy and sell books. The platform features user authentication with email verification, book listing management, and a purchasing system.

## 🚀 Features

### User Accounts
- **Authentication:** Secure Register and Login using JWT.
- **Email Verification:** OTP-based email verification upon registration.
- **Password Recovery:** Forgot and Reset Password functionality via email links.
- **Profile Management:** Update user name and password.

### Book Marketplace
- **Browse & Search:** View available books and search by title or author.
- **Book Details:** View detailed information including title, author, price, condition, and seller.
- **Sell Books:** Users can list books for sale with image uploads (stored locally).
- **Manage Listings:** Sellers can Edit or Delete their listings, and view a "My Listed Books" dashboard.

### Purchasing System
- **Buy Books:** Users can purchase books, which automatically marks them as "Sold".
- **Purchase History:** Users can view a history of their purchases.
- **Notifications:** Sellers receive an email notification when their book is sold.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Redux Toolkit** 
- **React Bootstrap** 
- **React Icons** 
- **React Hot Toast** 
- **Axios** 

### Backend
- **Node.js & Express** 
- **MongoDB & Mongoose** 
- **JWT (JSON Web Tokens)** 
- **Multer** 
- **Nodemailer**
- **BcryptJS** 
- **OTP Generator** 

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 1. Clone the Repository
git clone https://github.com/AbdulrahmanBassem/Book-Store-Buy-Sell-Books.git


### 2. Backend Setup
Navigate to the server directory and install dependencies:

Bash

cd server
npm install
Create a .env file in the server directory with the following variables:


PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret
NODE_ENV=development

EMAIL_HOST_PROVIDER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FROM_NAME=BookStore


CLIENT_ORIGIN=http://localhost:5173
PRODUCTION_ENV=false
Start the backend server:

npm start

### 3. Frontend Setup
Navigate to the client directory and install dependencies:

cd client
npm install
Create a .env file in the client directory:

Code snippet

VITE_BACKEND_BASE=http://localhost:5000
VITE_PRODUCTION_ENV=false
Start the frontend development server:

npm run dev

🔗 API Endpoints
Auth
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/verify - Verify email OTP
POST /api/auth/resend-otp - Resend verification OTP
POST /api/auth/forgot-password - Request password reset link
POST /api/auth/reset-password - Reset password with token
GET /api/auth/profile - Get current user profile (Protected)
PUT /api/auth/profile - Update user profile (Protected)
Books
GET /api/books - Get all available books (supports ?keyword= search)
GET /api/books/my-books - Get books listed by the logged-in user (Protected)
GET /api/books/:id - Get details of a specific book
POST /api/books - Create a new book listing (Protected)
PUT /api/books/:id - Update a book listing (Protected)
DELETE /api/books/:id - Delete a book listing (Protected)
Purchases
POST /api/purchases/:bookId - Buy a specific book (Protected)
GET /api/purchases - Get user's purchase history (Protected)

