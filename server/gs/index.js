import config from '@root/config'
import path from 'path'
import util from 'util'
import storage from '@root/config/storage'

export const uploadImage = (file, dir = 'avatars', filename) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const bucket = storage.bucket(config.BUCKET_NAME)
  const extname = path.extname(originalname)
  const blob = bucket.file(`${dir}/${filename ? `${filename}${extname}` : originalname.replace(/ /g, "_")}`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = util.format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
    .on('error', (e) => {
      console.log(e)
      reject(`Unable to upload image, something went wrong`)
    })
    .end(buffer)
})

export const deleteFile = async (filename, cb) => {
  try {
    await storage
      .bucket(config.BUCKET_NAME)
      .file(filename)
      .delete()
    // exec callback after deletion
    if (cb) {
      await cb(filename)
    }
  } catch (e) {
    throw new Error(e)
  }
}

export default storage