const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        minLength: 3,
        unique:true
    },
    name:{
      type:String,
      require:true,
      minLength: 3
    },
    passwordHash:{
      type:String,
      require:true,
      minLength: 3
    },
    // it will show the list of corresponding blogs for the user
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  })

  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
module.exports = mongoose.model('User',userSchema)