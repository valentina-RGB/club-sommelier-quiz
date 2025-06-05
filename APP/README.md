# CLUB SOMMELIER

A modern web application built with React, TypeScript, and Vite featuring real-time quiz functionality, user management, and admin dashboard.

## 🚀 Tech Stack

- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **TailwindCSS** - Styling
- **Tanstack Query** - Server State Management
- **Zustand** - Client State Management
- **React Hook Form** - Form Management
- **Socket.IO** - Real-time Communication
- **Framer Motion** - Animations
- **Radix UI** - UI Primitives

## 📋 Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**

## 🛠️ Installation

1. **Install dependencies**
   npm install


2. **Set up environment variables**
   
   Copy the environment template file:
   ```bash
   cp .env.template .env
   ```
   
   Then edit the `.env` file with your configuration:
   ```env
   VITE_API_URL="http://localhost:3000/api/v1"
   VITE_API_BASE_URL="http://localhost:3000"
   VITE_FRONTEND_URL="http://localhost:5173"
   ```

## 🏃‍♂️ Running the Application

### Development Mode
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### Linting
Run ESLint to check code quality:
```bash
npm run lint
```

## 🌍 Environment Variables

The application uses the following environment variables (prefix with `VITE_` for client-side access):

- `VITE_API_URL` - Backend API endpoint
- `VITE_API_BASE_URL` - Backend base URL
- `VITE_FRONTEND_URL` - Frontend application URL

Access environment variables in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 📁 Project Structure

```
src/
├── api/               # API layer (queries, mutations, schemas)
├── assets/           # Static assets (images, icons)
├── common/           # Shared components and utilities
│   ├── atoms/        # Basic UI components
│   ├── molecules/    # Composite components
│   ├── hooks/        # Custom React hooks
│   ├── ui/          # UI component library
│   └── utils/       # Utility functions
├── lib/             # External library configurations
├── router/          # Application routing
└── views/           # Page components
    ├── admin/       # Admin dashboard pages
    ├── clients/     # Client-facing pages
    └── home/        # Home page
```

## 🔧 Development Guidelines

- **Components**: Use TypeScript for all components
- **Styling**: Use TailwindCSS for styling
- **State Management**: Use Zustand for client state, Tanstack Query for server state
- **Forms**: Use React Hook Form with Zod validation
- **API**: All API calls should go through the centralized API layer

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting


## 📝 Notes

- This project uses Vite's environment variable system
- All client-side environment variables must be prefixed with `VITE_`
- The application includes real-time features using Socket.IO
- UI components are built with Radix UI primitives and styled with TailwindCSS

