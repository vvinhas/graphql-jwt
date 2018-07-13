import bcrypt from 'bcrypt'
import User from '../models/UserModel'

export default {
  Query: {
    user: (root, args, { user }) => user,
    users: async () => await User.find({})
  },
  Mutation: {
    addUser: async (root, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({ name, email, password: hashedPassword })
      
      return user
    }
  }
}