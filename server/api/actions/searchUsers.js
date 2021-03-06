import User from '@root/models/User'

export default async function (req) {
  const { query: { limit, username } } = req
  const users = await User.find({
    username: {
      $regex: username, $options: 'i',
      $ne: req.user?.username
    }
  }).limit(limit || 50)
  return users
}