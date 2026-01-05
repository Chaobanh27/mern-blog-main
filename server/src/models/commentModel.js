import mongoose from 'mongoose'

const { Schema } = mongoose

const commentSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    minLength: [3, 'Comment should contain at least 3 characters!']
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type:Boolean,
    default: true
  }
}, { collection: 'comments', timestamps: true })

const commentModel = mongoose.model('Comment', commentSchema)

export default commentModel