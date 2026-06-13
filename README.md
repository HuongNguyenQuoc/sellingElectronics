# SellingElectronics Backend

SellingElectronics is a backend RESTful API for an e-commerce system built with **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, and **Mongoose**.

The project includes core e-commerce features such as authentication, product management, shopping cart, order placement, and order status tracking.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT
- **API Testing:** Postman
- **Architecture:** Controller - Service - Repository Pattern

## Features

- User authentication with JWT
- Protected routes for authenticated users
- Product management APIs
- Shopping cart management
- Order placement
- Order status tracking
- Request validation
- Centralized error handling
- Clean project structure using Controller-Service-Repository pattern

## Project Structure
```bash
src/
├── config/              # Database configuration
├── controllers/         # Handle HTTP requests and responses
├── services/            # Business logic
├── repositories/        # Database queries
├── models/              # Mongoose schemas and models
├── routes/              # API routes
├── middlewares/         # Authentication and error handling
├── dtos/                # Request data types
├── common/              # Shared utilities and exceptions
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```
Main Modules
Authentication
Register user
Login user
Generate JWT token
Protect private routes
Products
Get all products
Get product by ID
Create product
Update product
Delete product
Cart
Get current user's cart
Add item to cart
Update item quantity
Remove item from cart
Clear cart
Orders
Place an order
Get user's orders
Track order status
API Endpoints

Some endpoint names may be adjusted depending on the final route structure.

Auth
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT token
Products
Method	Endpoint	Description
GET	/api/products	Get all products
GET	/api/products/:id	Get product by ID
POST	/api/products	Create a new product
PATCH	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product
Cart
Method	Endpoint	Description
GET	/api/cart	Get current user's cart
POST	/api/cart/items	Add product to cart
PATCH	/api/cart/items/:itemId	Update cart item quantity
DELETE	/api/cart/items/:itemId	Remove item from cart
DELETE	/api/cart	Clear cart
Orders
Method	Endpoint	Description
POST	/api/orders	Place an order
GET	/api/orders/my-orders	Get current user's orders
GET	/api/orders/:id	Get order details
PATCH	/api/orders/:id/status	Update order status
Environment Variables

Create a .env file in the root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
Installation

Clone the repository:

git clone https://github.com/HuongNguyenQuoc/SellingElectronics.git

Go to the project folder:

cd SellingElectronics

Install dependencies:

npm install

Run the development server:

npm run dev

Build the project:

npm run build

Run production build:

npm start
Example Request
Login
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "123456"
}
Add Item To Cart
POST /api/cart/items
Authorization: Bearer your_jwt_token
Content-Type: application/json
{
  "productId": "product_id_here",
  "quantity": 2
}
Architecture

This project follows the Controller-Service-Repository pattern:

Controller: Handles request and response logic.
Service: Contains business logic and validation.
Repository: Handles database operations.
Model: Defines database schemas using Mongoose.

This structure helps keep the codebase clean, maintainable, and easier to scale.

Future Improvements
Add role-based authorization for admin and users
Add payment integration
Add product reviews and ratings
Add order cancellation
Add unit and integration tests
Add API documentation with Swagger
Deploy backend to cloud platform
<img width="1913" height="967" alt="image" src="https://github.com/user-attachments/assets/d359ef37-415a-42d7-8ffa-b740e482a9c3" />
<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/4f6acccf-6808-4b48-b2d5-8583759f0665" />
<img width="1916" height="963" alt="image" src="https://github.com/user-attachments/assets/9b7cd391-2157-4bdc-9b19-4754e5f71c04" />



