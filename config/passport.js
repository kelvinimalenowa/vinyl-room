const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../app/models/user')

module.exports = function (passport) {

    //authenticate user using their email and password
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email.toLowerCase().trim() })

            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password.' })
            }

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }))

    //store the user's ID in the session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    //retrieve the user from MongoDB on subsequent requests
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id)
            done(null, user || false)
        } catch (err) {
            done(err)
        }
    })

}