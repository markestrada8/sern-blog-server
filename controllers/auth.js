import { db } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const register = (req, res) => {
  const getQuery = 'SELECT * FROM users WHERE email = ? OR username = ?'

  db.query(getQuery, [req.body.email, req.body.username], (error, data) => {
    if (error) {
      return res.json(error)
    }
    if (data.length) {
      return res.status(409).json('User already exists')
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?)'
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword
    ]

    db.query(insertQuery, [values], (error, data) => {
      if (error) {
        return res.json(error)
      }
      return res.status(200).json('User has been created')
    })
  })
}

export const login = (req, res) => {
  const getQuery = 'SELECT * FROM users WHERE username = ?'
  db.query(getQuery, [req.body.username], (error, data) => {
    if (error) {
      return res.json(error)
    }
    if (data.length === 0) {
      return res.status(401).json('User not found')
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)
    if (!isPasswordCorrect) {
      return res.status(403).json('Invalid username and/or password')
    }

    const token = jwt.sign({ id: data[0].user_id }, 'jwtkey')
    const { password, ...userData } = data[0]
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000
      })
      .status(200)
      .json(userData)
  })
}

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'none',
  })
    .status(200)
    .json('User has been logged out')
}