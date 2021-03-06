import User from '@root/models/User'

export default async function ({ limit, username = '', uname = '' }) {
  const users = await User.find({
    username: {
      $regex: username, $options: 'i',
      $ne: uname
    }
  })
  .select({ email: false, password: false })
  .limit(limit || 50)
  return users
}