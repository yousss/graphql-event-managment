const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const typeDefs = require('./src/types/index')
const resolvers = require('./src/resolvers/index')
const isAuth = require('./src/middleware/is-auth')

const mongoose = require('mongoose')

const port = 8080
const app = express()
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.wrcbs.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => console.error)

app.use(isAuth)
app.use(
  '/graphql',
  graphqlHTTP({ schema: typeDefs, rootValue: resolvers, graphiql: true }),
)

app.listen(port, () => {
  console.log('Server is running at localhost:' + port)
})
