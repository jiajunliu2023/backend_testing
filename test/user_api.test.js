const bcrypt = require('bcrypt')
const User = require('../models/User')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./user_test_helper')
const blog_helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in db', () =>{
    beforeEach(async () =>{
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', name: 'superUser',passwordHash})
        await user.save()
    })
})
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.userInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.userInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })



test('creation succeeds with a fresh username', async () =>{
    const userAtStart = await helper.userInDb()

    const newUser = {
        username: 'mluukkan',
      name: 'natti Luukkainen',
      password: 'salainen',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const userAtEnd = await helper.userInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
})

test.only('fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Tester',
    url: 'http://test.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

test.only('fails with status code 403 if user is not the creator', async () => {
  const blogsAtStart = await blog_helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  const invalidToken = await blog_helper.getInvalidUserToken();

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${invalidToken}`)
    .expect(403);
});

after(async () => {
  await mongoose.connection.close()
})

