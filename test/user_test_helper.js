const User = require('../models/User')

const initialeuser =  [
    

]

const nonExistingId = async () => {
  const user = new User({ })
  await user.save()
  await user.deleteOne()

  return user.id.toString()
}

const userInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
    initialeuser, nonExistingId, userInDb 
}