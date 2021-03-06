import User from '@root/models/User'

const models = {
  'User': User
}

export default async function (payload, modelName = 'User') {
  let docId = null
  if (payload._id) {
    docId = payload._id
    delete payload._id
  }
  const result = await models[modelName].findOneAndUpdate({ _id: docId }, { ...payload }, { new: true }) 
  return result 
}