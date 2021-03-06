import mongoose from 'mongoose'

const { Schema } = mongoose

const chatSchema = new Schema({
  chat_owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  chat_guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

const Chat = mongoose.model('Chat', chatSchema)

export default Chat