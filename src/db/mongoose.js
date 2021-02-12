const mongoose = require('mongoose')

module.exports = function connectionFactory() {
  return mongoose.createConnection(process.env.MONGODB_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    })
}