# Portfolio Website with Admin Dashboard

A modern portfolio website built with React, Node.js, Express, and MongoDB. Features include a gallery, blog posts, contact form, and a secure admin dashboard.

## Features

- 🎨 Modern and responsive design with dark mode support
- 📱 Mobile-friendly interface
- 🖼️ Gallery section for showcasing work
- 📝 Blog/Projects section
- 📬 Contact form with MongoDB storage
- 🔐 Secure admin dashboard
- 🎯 Protected routes with JWT authentication
- 🌐 MongoDB integration for data persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-website
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create environment variables:

Create a `.env` file in the root directory for frontend:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd ..
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Admin Setup

1. Create an admin user by running the setup script:
```bash
cd backend
node setup-admin.js
```

2. Login at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Project Structure

```
├── src/                      # Frontend source files
│   ├── components/           # Reusable React components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   └── assets/              # Static assets
├── backend/                 # Backend source files
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   └── routes/            # API routes
└── public/                 # Public static files
```

## Available Scripts

In the project directory:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

In the backend directory:

- `npm start` - Starts the backend server
- `npm run dev` - Runs the server in development mode with nodemon

## Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the backend to your preferred hosting service
3. Update the environment variables for production
4. Set up MongoDB Atlas for production use

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
