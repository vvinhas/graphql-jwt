import express from 'express'
import { ApolloServer } from 'apollo-server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import getToken from './src/helpers/getToken'
import getUser from './src/helpers/getUser'
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'

// Constants
const PORT = 4000
const JWT_SECRET = ' @._MyL1ttl3S3cr3t_.# '

// MongoDB
mongoose.connect('mongodb://localhost:27017/sandbox', { useNewUrlParser: true })

// Express
const app = express()

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: process.env.NODE_ENV !== 'production',
  context: async ({ req }) => {
    try {
      const token = getToken(req.headers.authorization)
      const { payload } = jwt.verify(token, JWT_SECRET)

      if (!payload.tenant)
        throw new Error('No Tenant')

      const user = await getUser(payload.tenant)

      return { user }
    } catch (err) {
      console.log(err)
      return {}
    }
  }
})
server.applyMiddleware({ app })

app.get('/token', (req, res) => {
  res.send(jwt.sign({ payload: { tenant: "5b48f6ff6a0eafa7aad5f91b" }}, JWT_SECRET))
})

app.listen({ port: PORT }, () => {
  console.log(`Server running on ${PORT}`)
})
