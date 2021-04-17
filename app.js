const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const typeDefs = require('./src/types/index')
const resolvers = require('./src/resolvers/index')
const isAuth = require('./src/middleware/is-auth')

const mongoose = require('mongoose')

const port = process.env.PORT || 8080
const app = express()
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

let production = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.wrcbs.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`

if (process.env.IS_PRODUCTION === 'dev') {
  production = `mongodb://localhost/${process.env.MONGODB_DB}`
}

try {
  mongoose.connect(production, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('MongoDB atlas has been connected')
} catch (error) {
  console.log(error)
}

app.use((req, res, next) => {
  res.setHeader('Access-Controll-Allow-Origin', '*')
  res.setHeader('Access-Controll-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Controll-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') {
    req.sendStatus(200)
  }
  next()
})

app.get('/', (req, res) => {
  res.send({ hello: 'Welcome to my app' })
})
app.use(isAuth)
app.use(
  '/graphql',
  graphqlHTTP({ schema: typeDefs, rootValue: resolvers, graphiql: true }),
)

app.listen(port, () => {
  console.log('Server is running at localhost:' + port)
})
