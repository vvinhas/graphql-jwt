import mongoose from 'mongoose'

export default mongoose.model('User', mongoose.Schema({
  name: String,
  email: String,
  password: String
}))
