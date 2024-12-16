const jwt = require('jsonwebtoken')
const User = require('../models/User'); 
const logger = require("./logger")

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name ===  'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
    }
    else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'token expired'
      })
    }
  
    next(error)
  }
  //extract the token from the request headers and validate it.
  const tokenExtractor = (request, response, next) =>{
    
        const authorization = request.get('authorization')
        if (authorization && authorization.startsWith('Bearer ')){
          request.token = authorization.replace('Bearer ', '')
          

          //store the decoded token into request.token
        }
        else{
          
          request.token = null 
        }
        next();
    
        
      
    }
    //find the authenticated user and attach it to the request object.
    const userExtractor = async (request, response, next)=>{
      
      const token = request.token;
      if (!token){
        return response.status(401).json({error:'missing token'});
      }
      
        const SECRET  = process.env.SECRET || 'default-fallback-secret'
        const decodedToken = jwt.verify(token, SECRET);
        if (!decodedToken.id){
          return response.status(401).json({ error: 'token invalid' })
        }
        request.user = await User.findById(decodedToken.id)
        next();
      
    }
  
  
  module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
  }