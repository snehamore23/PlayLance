# PayLance 🚀

Full-Stack MERN Freelancing Platform.

---

## 📁 Project Structure

```
PayLance/
├── client/
│   ├── src/
│   │   ├── assets/       # Static assets (images, icons)
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── layouts/      # Page layout wrappers
│   │   ├── pages/        # Application view pages
│   │   │   └── Home.jsx
│   │   ├── services/     # API and service integrations
│   │   │   └── api.js
│   │   ├── App.jsx       # Root router & layout
│   │   ├── index.css     # Tailwind CSS styles
│   │   └── main.jsx      # React DOM entry point
│   ├── .env              # Frontend environment variables
│   ├── index.html        # HTML template
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
    ├── config/           # Database and third-party configs
    ├── controllers/      # Route logic handlers
    ├── middleware/       # Custom Express middleware
    ├── models/           # Mongoose schemas & models
    ├── routes/           # Express router endpoints
    ├── utils/            # Helper functions & utilities
    ├── .env              # Backend environment variables
    ├── .gitignore
    ├── index.js          # Express app entry point
    └── package.json
```

---

## 🛠️ Tech Stack

- **Frontend**: React (v18), Vite, Tailwind CSS, React Router DOM, React Hot Toast, Axios
- **Backend**: Node.js, Express.js, Mongoose, CORS, Dotenv, Bcryptjs, JSON Web Tokens (JWT), Nodemon

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)

---

### 1. Backend Setup

Open a terminal in the `server` folder:

```bash
cd server
npm install
```

Configure your environment variables in `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/paylance
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend development server:

```bash
npm run dev
```

The API will be running at:
`http://localhost:5000/`

You can verify it returns:
```json
{
  "message": "PayLance API is running 🚀"
}
```

---

### 2. Frontend Setup

Open a second terminal in the `client` folder:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The React frontend will be accessible at:
`http://localhost:5173`

---

## 📜 Available Scripts

### Backend (`server/`)
- `npm start`: Runs the server with Node.
- `npm run dev`: Runs the server with Nodemon (auto-reloads on code changes).

### Frontend (`client/`)
- `npm run dev`: Runs the Vite development server.
- `npm run build`: Bundles the React application for production.
- `npm run preview`: Locally previews the production build.
