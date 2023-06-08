import { db } from '../db.js'
import jwt from 'jsonwebtoken'

export const getPosts = (req, res) => {

  const getQuery = req.query.category ? 'SELECT * FROM posts WHERE category=?' : 'SELECT * FROM posts'

  db.query(getQuery, [req.query.category], (error, data) => {
    if (error) {
      return res.status(500).json(error)
    }
    // console.log('get posts: ', data)
    return res.status(200).json(data)
  })
}

export const getPost = (req, res) => {
  const getQuery = 'SELECT post_id, username, title, content, posts.image, users.image AS user_image, category FROM users JOIN posts ON user_id = post_user_id WHERE post_id = ?'
  db.query(getQuery, [req.params.id], (error, data) => {
    if (error) {
      return res.status(500).json(error)
    }
    return res.status(200).json(data[0])

  })
}

export const addPost = (req, res) => {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json('Not authorized')
  }

  jwt.verify(token, 'jwtkey', (error, userData) => {
    if (error) {
      return res.status(403).json('Token not valid')
    }

    const insertQuery = 'INSERT INTO posts(title, content, image, category, date, post_user_id) VALUES (?)'

    const values = [req.body.title, req.body.content, req.body.image, req.body.category, req.body.date, userData.id]

    db.query(insertQuery, [values], (error, data) => {
      if (error) {
        return res.status(500).json('Error creating item')
      }
      return res.status(200).json('Post created')
    })
  })
}

export const updatePost = (req, res) => {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json('Not authorized')
  }

  jwt.verify(token, 'jwtkey', (error, userData) => {
    if (error) {
      return res.status(403).json('Token not valid')
    }

    const insertQuery = 'UPDATE posts SET title=?, content=?, image=?, category=? WHERE post_id=? AND post_user_id=?'

    const values = [req.body.title, req.body.content, req.body.image, req.body.category]

    db.query(insertQuery, [...values, req.params.id, userData.id], (error, data) => {
      if (error) {
        return res.status(500).json('Error creating item')
      }
      return res.status(200).json('Post updated')
    })
  })
}

export const deletePost = (req, res) => {
  const token = req.cookies.access_token

  if (!token) {
    return res.status(401).json('Not authorized')
  }

  jwt.verify(token, 'jwtkey', (error, userData) => {
    if (error) {
      return res.status(403).json('Token not valid')
    }
    const postId = req.params.id
    const deleteQuery = 'DELETE FROM posts WHERE post_id = ? AND post_user_id = ?'

    db.query(deleteQuery, [postId, userData.id], (error, data) => {
      if (error) {
        return res.status(403).json('Error deleting item')
      }
      return res.status(200).json('Post deleted')
    })
  })
}
