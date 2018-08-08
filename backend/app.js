const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express()

mongoose.connect('mongodb://localhost:27017/mean-stack', { useNewUrlParser: true })
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
  post.save()
  res.status(201).json({
    message: 'Post added successfully'
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
    .catch(() => {
      console.log('What the damn hell!')
    })
})

module.exports = app
