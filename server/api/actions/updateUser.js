import User from '@root/models/User'
import path, { basename } from 'path'
import { uploadImage, deleteFile } from '@root/gs'
import update from './update'

export default async function (req) {
  const { email, username, _id } = req.body
  const avatarFile = req.file
  const userId = req.user.id
  let imageUrl = ''

  try {
    if (req.file) {
      const currentUser = await User.findById(userId)
      const avatarUrl = currentUser.avatar
      if (avatarUrl) {
        const baseName = path.basename(avatarUrl)
        await deleteFile(`avatars/${baseName}`)
      }
      imageUrl = await uploadImage(avatarFile, 'avatars', userId)
    }
    const updatedUser = await update({
      username,
      email,
      _id,
      avatar: imageUrl
    }, 'User')

    return updatedUser
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }

}