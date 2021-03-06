import config from '@root/config'
import jwt from 'jsonwebtoken'

export default function (req, res, next) {
  const token = req.cookies['Authorization']
  if (!token) {
    return res.status(401).json({ message: 'Please, login to get started...' })
  }
  jwt.verify(token.split(' ')[1], config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Failed to authenticate token',
      })
    }
    req.user = decoded
    next()
  })
}