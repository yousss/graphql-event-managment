const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    isBooked: {
      type: Number,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('EventModel', eventSchema)
