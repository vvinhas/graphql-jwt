import User from '../../models/UserModel'

const getUser = async _id => await User.findOne({ _id })

export default getUser
