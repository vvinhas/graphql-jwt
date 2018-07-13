import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import jwt from 'jsonwebtoken'
// import flash from 'connect-flash'
import session from 'express-session'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { ApolloServer } from 'apollo-server'
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'

// Setup
const app = express()
const PORT = process.env.PORT || 8888
const JWT_SECRET = ' @._MyL1ttl3S3cr3t_.# '
const SESSION_SECRET = ' @._S3ss10nS3cr3t_.# '

// Passport Local Strategy Config
passport.use(new LocalStrategy((username, password, done) => {
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ payload: { auth: true }}, JWT_SECRET)
    return done(null, token)
  }
  else
    return done(null, false, { message: 'Credenciais Inválidas.' })
}))

// Passport JWT Strategy Config
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, (payload, done) => {
  console.log('PAYLOAD', payload)
  return done(null, payload)
}))

// Template Engine
app.set('view engine', 'pug')

// Express Middlewares
// app.use(session({
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

// Routes
// app.get('/login', (req, res) => {
//   res.render('login-form')
// })

app.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.send(req.user)
  }
)

app.use('/graphql', passport.authenticate('jwt', { session: false }))

const server = new ApolloServer({ typeDefs, resolvers })
server.applyMiddleware({ app, path: '/graphql' })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

// app.get('*', (req, res) => {
//   res.sendStatus(404)
// })

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`)
// })
