const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // with this dependencies, try-catch blocks are not needed and if the exception happens in an
//async route, the execution will be automatically passed to the error-handling middleware
 
const app = express()
const cors =require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // parsing
app.use(middleware.requestLogger)

//middleware.tokenExtractor and middleware.userExtractor are applied globally to the 
//all routes in '/api/blogs'
app.use('/api/blogs', middleware.tokenExtractor, middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.use(middleware.tokenExtractor)

module.exports = app