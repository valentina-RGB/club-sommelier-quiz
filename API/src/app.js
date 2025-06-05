const { connectToDatabase, sequelize } = require('./config/connection');
const { initializeWebSockets } = require('./sockets/index');
const routerApi = require('./routes/index');
const express = require('express');
const cors = require('cors');

const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');

require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.host = process.env.DB_HOST || 'localhost';
    this.httpServer = createServer(this.app);

    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: "*"
      }
    });

    initializeWebSockets(this.io);
    this.middlewares();
    this.routers();
    this.syncDataBase();
  }

  middlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(express.json());
  }

  routers() {
    routerApi(this.app);
  }

  async syncDataBase() {
    try {
      await connectToDatabase();
      require('./models');
      await sequelize.sync({ alter: true });

    } catch (error) {
      console.error('Error connecting to the database:', error.message);
      throw error;
    }
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`\n🚀 Server running at http://${this.host}:${this.port}/api/v1`);
    });
  }
}

module.exports = Server;