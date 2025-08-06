import express from 'express'
import dotenv from 'dotenv'
import conectDB from './src/config/mongo.config.js'
import authrouter from './src/routes/auth.route.js'
import profilerouter from './src/routes/profile.route.js'

import cookieparser from 'cookie-parser'
import { authmiddleware } from './src/middlewares/authmiddleware.js'
import projectrouter from './src/routes/project.route.js'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import User from './src/models/usermodel.js'
import Project from './src/models/projectmodel.js'
import { generateContent } from './src/services/ai.service.js'

dotenv.config()

const app = express()

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())

app.use(authmiddleware)

// ✅ Routes
app.get('/', (req, res) => {
  res.send({ user: req.user })
})
app.use('/api/auth', authrouter)
app.use('/project', projectrouter)
app.use("/profile", profilerouter)


// ✅ Create HTTP server and attach Socket.IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
})

// ✅ Socket.IO auth middleware
io.use(async(socket, next) => {
  try {
    let token;

    // Priority 1: token from auth (manual)
    if (socket.handshake.auth?.Access_Token) {
      token = socket.handshake.auth.Access_Token;
    }

    // Priority 2: token from cookies
    else if (socket.handshake.headers.cookie) {
      const parsedCookies = cookie.parse(socket.handshake.headers.cookie);
      token = parsedCookies.Access_Token;
    }

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    const projectid = socket.handshake.query.projectId;
    if (!projectid) {
      return next(new Error('Authentication error: Project ID not provided'));
    }
    const project  = await Project.findById(projectid);
    if (!project) {
      return next(new Error('Authentication error: Project not found'));
    }
    socket.project = project

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByEmail(decoded.email)
    socket.user = user;
    next();
  } catch (error) {
    console.error("Socket auth error:", error.message);
    next(new Error('Authentication error'));
  }
})

// ✅ Handle socket connection
io.on('connection', (socket) => {
  const projectId = socket.handshake.query.projectId;

   socket.roomId = projectId
   socket.join(socket.roomId);

  socket.on('massage', (data) => {
    const massage = data.message
    const isaipresent = massage.toLowerCase().includes('@ai')
    if (isaipresent) {
      const cleanedMessage = massage.replace('/@ai/gi', '').trim();
      const received = async () => {
        try {
          const response = await generateContent(cleanedMessage)
          socket.emit('message', { message: response, sender: "AI" });
        } catch (error) {
          console.error("Gemini API Error:", error.message);
          socket.emit('message', { message: "AI service unavailable. Please try again later.", sender: "AI" });
        }
      }
      return received()
    } else {
     
      socket.broadcast.to(socket.roomId).emit('message', { message: massage, sender: socket.user.name });
    }
    
    
    
    
    // socket.emit('reply', { message: 'Server theke reply' })
  });
 
  socket.on('disconnect', () => {
    socket.leave(socket.roomId)
  });
})

// ✅ Start server
server.listen(process.env.PORT, () => {
  conectDB()
  console.log(`🚀 Server is running on port ${process.env.PORT}`)
})
