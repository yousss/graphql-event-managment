const { user } = require('../helpers/transformData')
const { dateToString } = require('../helpers/date')
const EventModel = require('../models/EventModel')
const UserModel = require('../models/UserModel')

module.exports = {
  events: async () => {
    try {
      const events = await EventModel.find()
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: dateToString(event._doc.date),
          creator: user.bind(this, event._doc.creator),
        }
      })
    } catch (err) {
      throw err
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw Error('Unauthenticated.')
    }
    const event = new EventModel({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    })
    let createdEvent
    try {
      const result = await event.save()
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: dateToString(event._doc.date),
        creator: user.bind(this, result._doc.creator),
      }
      const creator = await UserModel.findById(req.userId)

      if (!creator) {
        throw new Error('User not found.')
      }
      creator.createdEvents.push(event)
      await creator.save()

      return createdEvent
    } catch (err) {
      console.log(err)
      throw err
    }
  },
}
