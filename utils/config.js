const dotenv = require("dotenv")
dotenv.config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MONGODB_URI || `mongodb+srv://fullstack:Chn,99900@cluster0.7gvzx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
:process.env.MONGODB_URI || `mongodb+srv://fullstack:Chn,99900@cluster0.7gvzx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// const mongoUrl =`mongodb+srv://fullstack:Chn,99900@cluster0.7gvzx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

module.exports = {
  MONGODB_URI,
  PORT
}