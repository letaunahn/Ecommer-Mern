import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import colors from 'colors'
import dbConnect from './config/db.js'
import productRouter from './routes/productRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()

dotenv.config()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

dbConnect()

app.use('/api/product', productRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('API Working')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.bgRed.white)
})