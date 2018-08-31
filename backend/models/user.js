const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-beautiful-unique-validation')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: 'Two users cannot share the same email ({VALUE})'
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
