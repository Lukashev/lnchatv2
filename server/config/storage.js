import { Storage } from '@google-cloud/storage'
import config from '@root/config'
import path from 'path'

const serviceKey = path.join(__dirname, './credentials.json')

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: config.GCLOUD_PROJECT_ID
})

export default storage