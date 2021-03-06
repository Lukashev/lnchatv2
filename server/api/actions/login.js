import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '@root/models/User'
import config from '@root/config'

export default async function (req, res) {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) throw new Error('User not found')

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    if (!passwordIsValid) throw new Error('Invalid password')

    const token = jwt.sign({ ...user, id: user._id, }, config.JWT_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('Authorization', `Bearer ${token}`, { maxAge: 604800000 })
    res.status(200).json({ result: user, token, message: `Welcome, ${user.email}!` })
  } catch (e) {
    res.status(401).send({ message: e.message })
  }
}