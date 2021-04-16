const { dateToString } = require('../helpers/date')
const { user, singleEvent } = require('../helpers/transformData')
const Event = require('../models/event')
const Booking = require('../models/Booking')
const isAuth = require('../middleware/is-auth')

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw Error('Unauthenticated.')
    }
    const bookings = await Booking.find({})
    return bookings.map((booking) => {
      return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt),
      }
    })
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw Error('Unauthenticated.')
    }
    const fetchEvent = await Event.findOne({ _id: args.eventId })
    const bookingEvent = new Booking({
      event: fetchEvent,
      user: req.userId,
    })
    const result = await bookingEvent.save()
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, result._doc.user),
      event: singleEvent.bind(this, result._doc.event),
      createdAt: dateToString(result.createdAt),
      updatedAt: dateToString(result.updatedAt),
    }
  },

  cancellBookingEvent: async (args, req) => {
    if (!req.isAuth) {
      throw Error('Unauthenticated.')
    }
    try {
      const booking = await Booking.findOne({ _id: args.bookingId })
      const event = {
        ...booking._doc,
        _id: booking.event,
        creator: user.bind(this, booking.user),
      }
      await Booking.deleteOne({ _id: args.bookingId })
      return event
    } catch (err) {
      throw err
    }
  },
}
