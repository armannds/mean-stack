const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize
  const currentPage = +req.query.page
  const postQuery = Post.find()
  let fetchedPosts
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize)
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
    .catch(err => {
      res.status(500).json({
        title: 'Error fetching posts',
        message: 'Something went wrong when fetching posts',
        error: err
      })
    })
}

exports.getPost = (req, res, next) => {
  Post.findById({ _id: req.params.id })
    .then(post => {
      if (post) {
        res.status(200).json({ message: 'Post found', post: post })
      } else {
        res.status(404).json({ message: 'Post not found!' })
      }
    })
    .catch(err => {
      res.status(500).json({
        title: 'Error fetching post',
        message: 'Something went wrong when fetching post',
        error: err
      })
    })
}

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file ? url + '/images/' + req.file.filename : '',
    creator: req.userData.userId
  })
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...result,
          id: result._id
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        title: 'Error creating a post!',
        message: 'Creating a post failed',
        error: err
      })
    })
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath
  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = url + '/images/' + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: 'Update successfull' })
      } else {
        res.status(401).json({
          title: 'Authorization error',
          message: 'Not authorized to edit post!'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        title: 'Error updating a post',
        message: 'Something went wrong when updating a post',
        error: err
      })
    })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successfull' })
      } else {
        res.status(401).json({ message: 'Not authorized to delete post!' })
      }
    })
    .catch(err => {
      res.status(500).json({
        title: 'Error deleting post',
        message: 'Something went wrong when deleting posts',
        error: err
      })
    })
}
