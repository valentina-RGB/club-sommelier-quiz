# Hackathon 2025 API

Backend API service for the Hackathon 2025 application. This service provides real-time quiz management with Socket.IO integration for interactive events.

## Features

- 🔐 **Authentication System** - Secure JWT-based authentication for administrators
- 📊 **Question Management** - Create and organize questions by difficulty levels and categories
- 📋 **Questionnaire Builder** - Create customizable questionnaires with selected questions
- 🎮 **Live Events** - Host interactive quiz events with real-time participation
- 👥 **Participant System** - Track participant data and event participation
- 📈 **Scoring System** - Automatic scoring based on response time and correctness

## Tech Stack

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator

## Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd hackathon-2025/API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.template .env
   # Edit .env with your actual configuration values
   ```

4. Set up the database:
   ```bash
   # Create database in PostgreSQL first, then:
   npx sequelize-cli db:migrate
   npm run seed
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Project Structure

```
├── src/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Request handlers
│   ├── database/         # Database seeders and migrations
│   ├── dtos/             # Data transfer objects
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Sequelize models
│   ├── repositories/     # Data access layer
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic layer
│   ├── sockets/          # WebSocket handlers
│   └── app.js            # Express app setup
├── index.js              # Application entry point
├── .env                  # Environment variables (not in repo)
├── .env.template         # Template for environment variables
├── .sequelizerc          # Sequelize CLI configuration
└── package.json          # Project dependencies and scripts
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.