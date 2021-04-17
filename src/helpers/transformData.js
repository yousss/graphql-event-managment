const EventModel = require('../models/EventModel')
const UserModel = require('../models/UserModel')
const { dateToString } = require('./date')

const events = async (eventIds) => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } })
    return events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator),
      }
    })
  } catch (err) {
    throw err
  }
}

const user = async (userId) => {
  try {
    const user = await UserModel.findById(userId)
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdEvents: events.bind(this, user._doc.createdEvents),
    }
  } catch (err) {
    throw err
  }
}

const singleEvent = async (eventId) => {
  const event = await EventModel.findById(eventId)
  return {
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator),
  }
}

exports.singleEvent = singleEvent
exports.events = events
exports.user = user
