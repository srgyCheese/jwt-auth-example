const {Schema, model} = require('mongoose')

schema = new Schema({
   token: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      expires: process.env.REFRESH_TOKEN_LIFETIME
   }
})

module.exports = model('RefreshToken', schema)