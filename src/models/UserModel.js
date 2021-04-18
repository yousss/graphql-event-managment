const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    address: {
      type: String,
      required: false,
    },
    full_name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'EventModel',
      },
    ],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', userSchema)
