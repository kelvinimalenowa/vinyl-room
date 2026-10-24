require('dotenv').config()
require('./config/database')

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

const app = express()
const PORT = process.env.PORT || 3000

//database connection
require('./config/database')

//middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))

//configuring session before user authentication session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax'
    }
}))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

//view engine
app.set('view engine', 'ejs')

//routes
require('./app/routes')(app)

//start server
app.listen(PORT, () => {
    console.log(`Vinyl Room running on port ${PORT}`)
})