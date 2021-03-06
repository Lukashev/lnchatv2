import express from 'express'
import verifyToken from '../utils/verifyToken'
import actions from './actions'

const router = express.Router()

router.post('/login', actions.login)
router.post('/signup', actions.signup)
router.get('/me', verifyToken, actions.getMe)
router.get('/users', verifyToken, async (req, res) => {
  try {
    return res.status(200).json({ result: await actions.searchUsers({ ...req.query, uname: req.user?._doc?.username }) })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})

export default router