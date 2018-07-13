import { gql } from 'apollo-server'

export default gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    user: User,
    users: [User]
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): User
  }
`