const { buildSchema } = require('graphql')

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}
type User {
  _id: ID!
  email: String!
  username: String!
  address: String!
  full_name: String
  password: String
  phone: String
  createdEvents: [Event!]
}
type AuthData {
  userId: ID!
  token:String!
  tokenExpiration: Int!
}
input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}
input UserInput {
  email: String!
  username: String!
  address: String
  phone: String
  full_name: String!
  password: String!
}
type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    users: [User!]
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancellBookingEvent(bookingId: ID!) : Event!
    login(username:String, password:String): AuthData!
    verifyToken(token:String): Boolean
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)
