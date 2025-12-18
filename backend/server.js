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
const cors = require('cors')

connectDB()
const app = express()

const allowedOrigins = process.env.CORS_ORIGINS.split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}))
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
const io = require('./config/socket')(server);

server.listen(PORT, console.log(`Listening to port ${PORT}`));