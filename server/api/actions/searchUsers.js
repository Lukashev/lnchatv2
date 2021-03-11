import User from '@root/models/User'

export default async function ({ limit, username = '', uid = '' }) {
  const users = await User.find({
    username: {
      $regex: username, $options: 'i'
    },
    _id: {
      $ne: uid
    }
  })
  .select({ email: false, password: false })
  .limit(limit || 50)
  return users
}