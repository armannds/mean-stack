const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    })
    user
      .save()
      .then(result => {
        if (result) {
          return res.status(201).json({
            message: 'User successfully created!',
            result: result
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          title: 'Signup failed!',
          message: "User name taken or password doesn't match standards.",
          error: err
        })
      })
  })
}

exports.loginUser = (req, res, next) => {
  let fetchedUser
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          title: 'Login failed',
          message: 'Invalid authentication credentials'
        })
      }
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          title: 'Login failed',
          message: 'Invalid authentication credentials'
        })
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      )
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      })
    })
    .catch(err => {
      return res.status(401).json({
        title: 'Login failed',
        message: 'Invalid authentication credentials',
        error: err
      })
    })
}
