import bcrypt from 'bcrypt'
import User from '@root/models/User'

export default async function (req, res) {
  const { password, email, username } = req.body
  try {
    const user = await User.findOne({ email })
    if (user) throw new Error('Such user already exists')

    const hashedPassword = bcrypt.hashSync(password, 8)
    await User.create({ email, username, password: hashedPassword })

    return res.status(200).json({ message: 'You are registered successfully' })
  } catch (e) {
    res.status(400).send({ message: e.message })
  }
}