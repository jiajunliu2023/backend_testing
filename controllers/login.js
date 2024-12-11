//for login functionality
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

//verify whether the username and login match or not
loginRouter.post('/', async(request, response) =>{
    const {username, password} = request.body

    const user = await User.findOne({username})
    const passwordCorrect = user === null 
    ? false
    : await bcrypt.compare(password, user.passwordHash)
    
    if (!(user && passwordCorrect)){
        return response.status(401).json({
            error:'invalid username or password'
        })
    }

    // the token is digitally signed by a string from the environment variable SECRET as the secret
    //The digital signature ensures that only parties who know the secret can generate a valid token. The value for the environment variable must be set in the .env file.
    const userToken = {
        username: user.username,
        id:user._id
    }
    const SECRET = process.env.SECRET || 'default-fallback-secret';
    const token = jwt.sign(userToken, SECRET, {expiresIn: 60*60})
    // token expires in 60*60 seconds, that is, in one hour
    //once the token expires, the user will need to login again

    response
        .status(200)
        .send({token, username: user.username, name: user.name})
})

module.exports = loginRouter
