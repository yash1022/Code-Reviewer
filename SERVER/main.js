
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { urlencoded } from 'express'
import authRoutes from './ROUTES/auth.routes.js'
import featureRoutes from './ROUTES/feature.routes.js'
import connectDB from './DB/connectDB.js'

const app = express()

connectDB();

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/features', featureRoutes)

export default app
