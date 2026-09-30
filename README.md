# 🚀 PlayLance - Full-Stack Freelancing Platform

PlayLance is a modern, feature-rich MERN (MongoDB, Express, React, Node.js) stack freelancing marketplace that connects clients with skilled freelancers. From job posting and proposal submission to real-time messaging, Stripe-powered payments, and review systems, PlayLance offers a complete end-to-end platform for freelance collaboration.

---

## ✨ Features

- 🔐 **Authentication & Authorization**: Secure JWT authentication, password hashing with Bcrypt, role-based controls (Client vs. Freelancer), and password reset flows.
- 💼 **Project Marketplace**: 
  - Clients can post, edit, manage, and close projects specifying budgets, skills, deadlines, and project scope.
  - Freelancers can browse, search, and filter available projects by category, skills, and budget range.
- 📝 **Proposals & Bidding**:
  - Freelancers submit detailed proposals with bid amounts, estimated timeline, and custom cover letters.
  - Clients review applications, view freelancer profiles, and accept or reject proposals.
- 💬 **In-App Messaging**: Interactive messaging system for seamless communication between clients and freelancers regarding project milestones and deliverables.
- 💳 **Stripe Payments & Escrow**: Integrated Stripe Checkout for project payments, escrow holding, and transaction management.
- ⭐ **Ratings & Reviews**: Post-project feedback system with 5-star ratings and written reviews to build platform reputation.
- 📊 **Interactive Dashboard & Analytics**: Dynamic dashboards tailored for clients and freelancers showing active jobs, total earnings/spend, proposal status, and quick actions.
- 🔔 **Notifications**: Real-time notifications for job applications, accepted proposals, messages, and payment updates.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **UI Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
- **Security**: [BcryptJS](https://github.com/dcodeIO/bcrypt.js) & [JSON Web Tokens (JWT)](https://jwt.io/)
- **Payment Processing**: [Stripe API](https://stripe.com/)
- **Development Tooling**: [Nodemon](https://nodemon.io/), `dotenv`, `cors`

---

## 📁 Project Structure

```text
PlayLance/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── assets/             # Static graphics and branding assets
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/            # React context providers (AuthContext, Socket/Chat context)
│   │   ├── layouts/            # Main application layouts
│   │   ├── pages/              # Main route views
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Dashboard.jsx   # Client / Freelancer dashboard
│   │   │   ├── Projects.jsx    # Browse project listings
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── PostProject.jsx # Create new project listing
│   │   │   ├── Applications.jsx# Applications & proposal manager
│   │   │   ├── Messages.jsx    # Messaging interface
│   │   │   ├── Payments.jsx    # Payment history & escrow
│   │   │   ├── Reviews.jsx     # Feedback & ratings
│   │   │   ├── Profile.jsx     # User profile management
│   │   │   └── ...
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── App.jsx             # Routes & app wrapper
│   │   ├── index.css           # Global Tailwind CSS entry
│   │   └── main.jsx            # Application mount point
│   ├── .env                    # Frontend environment variables
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite build config
│
└── server/                     # Backend Express API Server
    ├── config/                 # Database connection & Stripe setup
    ├── controllers/            # Logic handlers for business rules
    ├── middleware/             # Auth middleware, validation, error handlers
    ├── models/                 # Mongoose schemas (User, Project, Application, Message, Payment, Review, Notification)
    ├── routes/                 # Express API routes
    ├── utils/                  # Helper utilities (token generators, formatters)
    ├── index.js                # Server entry point
    ├── .env                    # Backend environment variables
    └── package.json            # Backend dependencies
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [npm](https://www.npmjs.com/) (v9.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A [Stripe Account](https://stripe.com/) for test payment keys

---

### Installation & Environment Setup

#### 1. Backend Setup (`server/`)

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=development
```

Start the backend API in development mode (with Nodemon):

```bash
npm run dev
```

The API server will run at `http://localhost:5000`.

---

#### 2. Frontend Setup (`client/`)

Open a new terminal, navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the Vite development server:

```bash
npm run dev
```

The React frontend will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints Summary

| Endpoint Range | Router | Description |
| :--- | :--- | :--- |
| `/api/auth` | `authRoutes.js` | User Registration, Login, Current User profile, Password Reset |
| `/api/users` | `userRoutes.js` | Update profile details, bio, skills, hourly rate, view public profiles |
| `/api/projects` | `projectRoutes.js` | Create, fetch, filter, update, and delete job postings |
| `/api/applications` | `applicationRoutes.js` | Submit proposals, view project proposals, accept/reject bids |
| `/api/messages` | `messageRoutes.js` | Create conversations, fetch messages, send chat messages |
| `/api/payments` | `paymentRoutes.js` | Stripe Checkout session creation, escrow release, payment history |
| `/api/reviews` | `reviewRoutes.js` | Create reviews, fetch ratings for projects and freelancers |
| `/api/notifications` | `notificationRoutes.js` | Fetch user alerts, mark notifications as read |
| `/api/dashboard` | `dashboardRoutes.js` | Get role-specific dashboard metrics and activity overview |

---

## 📜 Scripts Reference

### Backend (`/server`)
- `npm run dev`: Runs server with hot reloading via Nodemon.
- `npm start`: Runs production server using standard Node.js.

### Frontend (`/client`)
- `npm run dev`: Launches Vite dev server.
- `npm run build`: Generates production-ready bundle.
- `npm run preview`: Serves production build locally for testing.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve PlayLance:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
