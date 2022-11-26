const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const { MONGODB_URL } = require('./lib/config')
const app = express()

const user = require('./routes/user')
const playlist = require('./routes/playlist')
const port = process.env.PORT || 4000

mongoose.connect(
  MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },
  () => {
    console.log('Mongoose is connected')
  }
)
//
//middleware
//
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://maelixmusic.web.app'],
    credentials: true
  })
)

app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 * 1000 }
  })
)

app.use(cookieParser('secretcode'))
app.use(passport.initialize())
app.use(passport.session())
require('./passportConfig')(passport)
//
//end of middleware
//

//
//Routes
//

app.use('/user', user)
app.use('/playlist', playlist)

app.get('/', (req, res) => {
  res.json('Hello')
})

app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})

module.exports = app
