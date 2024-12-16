//The event handlers of routes are commonly referred to as controllers
//it is about the routers containing multiple api request (endpoints)

const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

const middleware = require('../utils/middleware')

const Blog = require('../models/blog')
const User = require('../models/User')



// blogsRouter.get('/', (request, response) => {
//     Blog
//       .find({})
//       .then(blogs => {
//         response.json(blogs)
//       })
//   })


//when displaying the blogs, the corresponding user with username and name will be shown
blogsRouter.get('/',async (request, response)=>{
  const user = request.user;
  if (!user){
    return response.status(401).json({ error: 'unauthorized' }); 
  }
  //filter to show only blogs corresponding to authorized user
  const blogs = await Blog.find({user: user.id}).populate('user',{username:1, name:1})
  response.json(blogs)
})

blogsRouter.get('/:id', async(request, res, next)=>{
  
  try{
    const blog = await Blog.findById(request.params.id)
    if (blog){
      res.json(blog)
    }else{
      res.status(404).send({ error: 'Blog not found' });
    }
  }
  catch(error){
    next(error)
  }
})

// blogsRouter.post('/', (request, response) => {
//     const blog = new Blog(request.body)
  
//     blog
//       .save()
//       .then(result => {
//         response.status(201).json(result)
//       })
//   })

// const getTokenFrom = request =>{
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')){
//     return authorization.replace('Bearer ','')
//   }
//     return null
// }

blogsRouter.delete('/:id',  async (req, rep, next) =>{
  try{
    const blog = await Blog.findById(req.params.id)

    if (!blog){
      return response.status(404).json({error:'blog is not found'})
    }
    if (blog.user.toString() != request.user.id.toString()){
      return response.status(403).json({ error: 'only the creator can delete this blog' });
    }
    await Blog.findByIdAndDelete(req.params.id)
    rep.status(204).end();
  }
  catch(error){
    next(error);
  }
})

blogsRouter.post('/',  async (request,  response, next) => {

  //the user id is not require, as the user id can be got through from the authorized user through authorization
  const {title, url, author, likes, userid } = request.body;

  // const SECRET = process.env.SECRET || 'default-fallback-secret';

  // const decodedToken = jwt.verify(middleware.tokenExtractor(request), SECRET)
  // if (!decodedToken.id){
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id)
  // //replace "const user = await User.findById(userid)" to authorize the user
  // // and find out the user of blog by user id 

  if (!title || !url){
    return response.status(400).json({ error: 'title and url are required' })
  }
  
  try{
    //when add the blog the user id is needed to refer to the user
  const user = request.user;
  // const blog = new Blog(request.body)

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user.id
  })

  

    const savedBlog = await blog.save()

    //this step is to store the blog to the corresponding user and save in user schema
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})



blogsRouter.put('/:id', (req, res, next) =>{
  const {title, url, likes, author} = req.body

  const updatedBlog = {title, url, likes, author}

  Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true })
    .then(updatedBlog => {
      res.json(updatedBlog)
    })
    .catch(error => {
      next(error)
    });// Send a more informative error response)
})

  module.exports = blogsRouter