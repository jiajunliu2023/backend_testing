const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  //before testing
  await Blog.deleteMany({}) //delete all objects 
  await Blog.insertMany(helper.initialeblogs) // insert all objects 
})



test('blogs are returned as json', async () => {
  console.log('entered test')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})





//4.8
test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialeblogs.length)
  })
  
  test('the first blog is about HTTP methods', async () => {
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(e => e.title)
    assert(titles.includes("React patterns"))
  })


  //4.9
  //check whether the unique identifier is id 
  test("the unique identifier property of the blog is id", async ()=>{
    const response = await api.get('/api/blogs')
    const blogs = response.body
    
   // Check if 'id' is defined
  assert.ok(blogs[0].id, "The 'id' property should be defined")
  // Ensure '_id' is not present
  assert.strictEqual(blogs[0]._id, undefined, "The '_id' property should be undefined")

  }) 

  
  

  // 4.11
  //if likes is missing, it will be value 0
  test('if likes is missing, it will be value 0', async () => {
    const newBlog = {
      id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      __v: 0
    }
  
    const r = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    // const response = await api.get('/api/blogs')
    
    // r.boby is the added blog
    assert.strictEqual(r.body.likes, 0, "the default value for likes should be 0")
  
  })
  //4.10
  // check whether the title or url is missimg
  test('blog without url or title is not added ', async () => {
    const newBlog = {
      id: "5a422b3a1b54a676234d17f9",
      author: "Edsger W. Dijkstra",
      // title: "Canonical string reduction",    
      __v: 0
    }
  
     await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      // .expect('Content-Type', /application\/json/)
  
    // const response = await api.get('/api/blogs')
    
    // r.boby is the added blog
    // assert.strictEqual(r.status, 400, "the title or url is missimg")

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialeblogs.length)
  
  })

  //check getting blogs

  test('all blogs are returned', async () => {
    // const response = await api.get('/api/blogs')
    const blogs = await helper.blogsInDb()
  
     assert.strictEqual(blogs.length, helper.initialeblogs.length)
  })
   

    //check posting a blog
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    //* 
    const blogsAtEnd = await helper.blogsInDb()
    // const response = await api.get('/api/blogs')
  
    
    assert.strictEqual(blogsAtEnd.length, helper.initialeblogs.length + 1)
    const titles = blogsAtEnd.map(r => r.title)
  
    assert(titles.includes('Canonical string reduction'))
  })
  
  //delete 
  test('succeeds with status code 204 if id is valid', async () =>{
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
        
        const blogAtEnd = await helper.blogsInDb()
        
        assert.strictEqual(blogAtEnd.length, helper.initialeblogs.length -1)

        const titles = blogAtEnd.map(t => t.title)
        assert(!titles.includes(blogToDelete.title))
    })

   


    //update
    test.only('update the number likes of a blog post', async () =>{
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        ...blogToUpdate, //copy the existing blogs fields
        likes: blogToUpdate. likes + 1
      }


      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedblog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id) // find out the blog that has been updated 
        assert.strictEqual(updatedblog.likes, blogToUpdate.likes + 1)
    })
  
  

  after(async () => {
    await mongoose.connection.close()
  })