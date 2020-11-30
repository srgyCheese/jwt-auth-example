const {Schema, model} = require('mongoose')

schema = new Schema({
   login: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   }
})

module.exports = model('User', schema)