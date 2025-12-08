require('dotenv').config()
const express = require("express")
const path = require('path')
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const morgan = require('morgan')

connectDB()
const app = express()

app.use(express.json())

// Logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --------------------------deployment------------------------------
app.use(notFound)
app.use(errorHandler)

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  }
})

app.set('io', io);

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('join_chat', (room) => {
    socket.join(room)
    console.log('User joined Room: ' + room)
  })

  socket.on('typing', (room, userId) => socket.in(room).emit('typing', userId))
  socket.on('stop_typing', (room, userId) => socket.in(room).emit('stop_typing', userId))

  socket.off('setup', () => {
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })
})

server.listen(PORT, console.log(`Listening to port ${PORT}`));