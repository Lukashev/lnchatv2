import express from 'express'
import verifyToken from '../utils/verifyToken'
import actions from './actions'

const router = express.Router()

router.post('/login', actions.login)
router.post('/signup', actions.signup)
router.get('/me', verifyToken, actions.getMe)
router.get('/users', verifyToken, actions.searchUsers)

export default router