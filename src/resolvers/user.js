const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  users: async () => {
    try {
      return await User.find({})
    } catch (error) {
      throw error
    }
  },

  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email })
      if (existingUser) {
        throw new Error('User exists already.')
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

      const user = new User({
        email: args.userInput.email,
        username: args.userInput.username,
        phone: args.userInput.phone,
        address: args.userInput.address,
        password: hashedPassword,
      })

      const result = await user.save()

      return { ...result._doc, password: null, _id: result.id }
    } catch (err) {
      throw err
    }
  },
  login: async ({ username, password }) => {
    const user = await User.findOne({ username })
    if (!user) {
      throw Error('User does not exist')
    }

    const isEqal = await bcrypt.compare(password, user.password)
    if (!isEqal) {
      throw Error('Auth failed')
    }
    const token = jwt.sign(
      { userId: user.id, username: username },
      'superSecret',
      { expiresIn: '1h' },
    )

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    }
  },
}
