import express from 'express'
import dotenv from 'dotenv'
import conectDB from './src/config/mongo.config.js'
import authrouter from './src/routes/auth.route.js'
import cookieparser from 'cookie-parser'
import { authmiddleware } from './src/middlewares/authmiddleware.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieparser())
app.use(authmiddleware)

app.get('/',(req,res)=>{res.send("Hello from backend")})
app.use('/api/auth',authrouter)

app.listen(process.env.PORT,()=>{
    conectDB()
    console.log(`Server is running on port ${process.env.PORT}` )
})