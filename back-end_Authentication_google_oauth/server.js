const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const app = express()

const auth = require('./routes/auth')

const db = require('./config/keys').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log(`mongodb is conneted`))
.catch(err => console.log(err))

app.get('/', (req, res) => res.json('sina'))

app.use(cookieParser())
app.use(session({
 secret: 'secret',
 resave: false,
 saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use((req, res, next) => {
 res.locals.user = req.user || null
 next()
})

app.use('/auth', auth)

const port = process.env.PORT || 1368
app.listen(port, () => console.log(`server is running on port ${port}`))