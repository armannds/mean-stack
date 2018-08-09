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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
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

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post)
    .then((result) => {
      res.status(200).json({message: 'Update successfull'})
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

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById({_id: req.params.id})
    .then(post => {
      if (post) {
        res.status(200).json({message: 'Post found', post: post})
      } else {
        res.status(404).json({message: 'Post not found!'})
      }
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