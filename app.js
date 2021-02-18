require('dotenv').config()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const express = require('express')

const needAuth = require('./middleware/needAuth.middleware')

const app = express()

app.use(express.json({extended: true}))

app.use(cookieParser())

app.use(express.static('./client/public'))

app.get('/', (req, res) => {
   res.sendFile('./client/public/index.html')
})

app.use('/api/auth', require('./routes/auth.routes'))

app.get('/api/needAuth', needAuth, (req, res) => {
   res.json({message: `Your id is ${req.body.user.userId}`})
})

const start = async () => {
   await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
   })

   app.listen(process.env.PORT)
}

start()