const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const methodOverride = require('method-override')
const app = express()

const { truncate, noTag, formatTime, editIcon } = require('./helper/hbs')

app.engine('handlebars', exphbs({
 helpers: {
  truncate,
  noTag,
  formatTime,
  editIcon
 },
 defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

const auth = require('./routes/auth')
const index = require('./routes/index')
const stories = require('./routes/stories')

const db = require('./config/keys').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log(`mongodb is conneted`))
.catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())

app.use(methodOverride('_method'))

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

app.use(express.static(path.join(__dirname, 'public')))
app.use('/stories', stories)
app.use('/auth', auth)
app.use('/', index)

const port = process.env.PORT || 1368
app.listen(port, () => console.log(`server is running on port ${port}`))