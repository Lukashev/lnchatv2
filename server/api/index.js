import express from 'express'
import multer from 'multer'
import verifyToken from '../utils/verifyToken'
import actions from './actions'

const router = express.Router()
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

router.post('/login', actions.login)
router.post('/signup', actions.signup)
router.post('/user', [verifyToken, multerMid.single('avatar')], async (req, res) => {
  try {
    const result = await actions.updateUser(req)
    return res
      .status(200).
      json({ result, message: 'Profile was successfully updated' })
  } catch (e) {
    res.status(500).send(e.message)
  }
})
router.get('/me', verifyToken, actions.getMe)
router.get('/chats', verifyToken, actions.getChatList)
router.get('/users', verifyToken, async (req, res) => {
  try {
    return res.status(200).json({ result: await actions.searchUsers({ ...req.query, uname: req.user?._doc?.username }) })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
})


export default router