import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Email address is required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Password is required'],
  },
  avatar: {
    type: String,
    required: false,
    default: ''
  },
  regDate: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)

export default User