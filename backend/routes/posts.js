const express = require('express')
const multer = require('multer')
const Post = require('../models/post')

const router = express.Router()

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error('Invalid mime type')
    if (isValid) {
      error = null
    }
    callback(error, 'backend/images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    callback(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  })
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...result,
        id: result._id
      }
    })
  })
})

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + '/images/' + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  })
  Post.updateOne({_id: req.params.id}, post)
    .then((result) => {
      res.status(200).json({message: 'Update successfull'})
    })
})

router.get('', (req, res, next) => {
  const pageSize = +req.query.pageSize
  const currentPage = +req.query.page
  const postQuery = Post.find()
  let fetchedPosts
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery
    .then(docs => {
      fetchedPosts = docs
      return Post.countDocuments()
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
})

router.get('/:id', (req, res, next) => {
  Post.findById({_id: req.params.id})
    .then(post => {
      if (post) {
        res.status(200).json({message: 'Post found', post: post})
      } else {
        res.status(404).json({message: 'Post not found!'})
      }
    })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(() => {
    res.status(200).json({
      message: 'Post deleted'
    })
  })
})

module.exports = router
