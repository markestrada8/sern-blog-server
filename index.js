import express from 'express'
import cors from 'cors'
import multer from 'multer'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  },
})

const upload = multer({ storage: storage })
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file
  res.status(200).json(file.filename)
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)


app.listen(8800, () => {
  console.log('listening on port 8800')
})