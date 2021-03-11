import mongoose from 'mongoose'

const { Schema } = mongoose

const msgSchema = new Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  unread: {
    type: Boolean,
    default: true
  }
})

const Message = mongoose.model('Message', msgSchema)

export default Message