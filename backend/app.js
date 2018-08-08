const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express()

mongoose.connect('mongodb://localhost:27017/mean-stack', {useNewUrlParser: true})
  .then(() => {
    console.log('Connected to db!')
  })
  .catch(() => {
    console.log('Connection failed!')
  })

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next()
})

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  })
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    })
  })
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(docs => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: docs
      })
    })
})

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.status(200).json({
      message: 'Post deleted'
    })
  })
})

module.exports = app
