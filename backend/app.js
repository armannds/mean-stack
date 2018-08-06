const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next()
})

app.post('/api/posts', (req, res, next) => {
  const posts = req.body
  console.log(posts)
  res.status(201).json({
    message: 'Post added successfully'
  })
})

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'aw87643cdro7p3',
      title: 'First Post',
      content: "This is the first post's content"
    },
    {
      id: '987x3987b',
      title: 'Second Post',
      content: "This is the second post's content"
    },
    {
      id: '90n83b2n80230',
      title: 'Third Post',
      content: "This is the third post's content"
    }
  ]
  res.status(200).json({
    message: 'Posts fetched successfully',
    posts: posts
  })
})

module.exports = app
