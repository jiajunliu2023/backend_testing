const bcrypt = require('bcrypt')
const usersRouter = require("express").Router()
const User = require('../models/User')

usersRouter.post('/',async (req, res)=>{

  //when the user is added, and blog will be an empty list
    const {username, name, password} = req.body
    
    const saltRounds = 10
    const passwordHash =await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })
    const saveUser = await user.save()
    res.status(201).json(saveUser)
})

usersRouter.get('/',async (request, response)=>{
    //when getting the user, its corresponding blogs will be refered and blogs will only show url, title, and author 
    const users = await User.find({}).populate('blogs', {url:1, title:1, author:1})
    response.json(users)
})
usersRouter.get('/:id', async(request, res, next)=>{
  
    try{
      const user = await User.findById(request.params.id)
      if (user){
        res.json(user)
      }else{
        res.status(404).send({ error: 'user not found' });
      }
    }
    catch(error){
      next(error)
    }
  })

usersRouter.delete('/:id', async (req, rep) =>{
    await User.findByIdAndDelete(req.params.id)
    rep.status(204).end()
  })
module.exports = usersRouter
