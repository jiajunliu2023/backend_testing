//The event handlers of routes are commonly referred to as controllers
//it is about the routers containing multiple api request (endpoints)

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

// blogsRouter.get('/', (request, response) => {
//     Blog
//       .find({})
//       .then(blogs => {
//         response.json(blogs)
//       })
//   })

blogsRouter.get('/', async (request, response)=>{
  const blogs = await Blog.find({})
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

blogsRouter.post('/', async (request, response, next) => {
  if (!request.body.title || !request.body.url){
    return response.status(400).json({ error: 'title and url are required' })
  }
  const blog = new Blog(request.body)

  
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (req, rep) =>{
  await Blog.findByIdAndDelete(req.params.id)
  rep.status(204).end()
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