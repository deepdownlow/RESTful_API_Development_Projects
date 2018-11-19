const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')

const app = express()

const user = require('./routes/user')
const profile = require('./routes/profile')

const db = require('./config/keys').mongoURI
mongoose.connect(db, {useNewUrlParser: true})
 .then(() => console.log(`mongodb is connected`))
 .catch(err => console.log(err))

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(passport.initialize())
require('./config/passport')(passport)

app.use('/user', user)
app.use('/profile', profile)

const port = process.env.PORT || 1368
app.listen(port, () => console.log(`server is running on port ${port}`))