
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { urlencoded } from 'express'
import authRoutes from './ROUTES/auth.routes.js'
import featureRoutes from './ROUTES/feature.routes.js'
import aiRoutes from './ROUTES/ai.routes.js'
import connectDB from './DB/connectDB.js'
import { errorHandler } from './MIDDLEWARE/errorHandler.Middleware.js'
import {connectRedis} from './DB/connectRedis.js'

const app = express()

await connectDB();
await connectRedis();

app.use(express.json(
    
))
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}


))

app.use('/api/auth', authRoutes)
app.use('/api/features', featureRoutes)
app.use('/api/ai',aiRoutes)

app.use(errorHandler);



export default app
