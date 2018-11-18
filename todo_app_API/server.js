const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

const todo = require('./routes/todo')

const db = require('./config/keys').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
 .then(() => console.log(`mongoDB and mlab is connected`))
 .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/todo', todo)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`server is running on port ${port}`)) 