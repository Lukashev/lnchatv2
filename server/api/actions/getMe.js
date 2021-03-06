import User from '@root/models/User'

export default async function (req, res) {
  try {
    const user = await User.findById(req.user.id)
    delete user.password
    return res.status(200).json({ result: user })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}