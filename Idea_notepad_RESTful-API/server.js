const express = require('express')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')
const app = express()

const ideas = require('./routes/ideas')
const users = require('./routes/users')

require('./config/passport')(passport)

const db = require('./config/keys').mongoURI
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log(`MongoDB is connected`))

app.use(express.static('public'))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(session({
  secret: 'sina',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

app.get('/', (req, res) => res.render('landing'))
app.get('/about', (req, res) => res.render('about'))

app.use('/ideas', ideas)
app.use('/user', users)

const port = process.env.PORT || 1001
app.listen(port, () => console.log(`server is running on port ${port}`))