require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const http         = require('http');
const { Server }   = require('socket.io');
const path         = require('path');
const cookieParser = require('cookie-parser');

const app    = express();
const server = http.createServer(app);

// ── CORS origins ──────────────────────────────────────────────────────────
const corsOrigins = process.env.CORS_ORIGIN
  ? [process.env.CORS_ORIGIN, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

// ── Socket.io ─────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: corsOrigins, credentials: true },
});

// ── Express middleware ─────────────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: corsOrigins, credentials: true }));

// Serve uploaded product images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────
const authRoutes     = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes  = require('./src/routes/productRoutes');
const messageRoutes  = require('./src/routes/messageRoutes');

app.use('/categories', categoryRoutes);
app.use('/products',   productRoutes);
app.use('/api/auth',   authRoutes);
app.use('/messages',   messageRoutes);

// ── Socket.io — real-time chat ─────────────────────────────────────────────
const Message = require('./src/models/Message');

io.on('connection', (socket) => {

  // Buyer joins a chat room keyed by productId-sellerId
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  // Relay and persist an outgoing message
  socket.on('send-message', async ({ senderId, receiverId, productId, text, roomId }) => {
    try {
      const message = await Message.create({
        sender:   senderId,
        receiver: receiverId,
        product:  productId,
        text,
      });
      await message.populate('sender', 'name');
      io.to(roomId).emit('receive-message', message);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  });
});

// ── DB + Server start ─────────────────────────────────────────────────────
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}. http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();