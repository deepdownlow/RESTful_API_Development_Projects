const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const db = require('./config/keys').mongoURI
mongoose
 .connect(db, { useNewUrlParser: true })
 .then(() => console.log(`mLab is connected`))
 .catch(err => console.log(err))

app.use(passport.initialize())
require('./config/passport')(passport)

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)
const port = process.env.PORT || 1368
app.listen(port, () => console.log(`server running on port ${port}`))