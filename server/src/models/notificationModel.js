import mongoose from 'mongoose'

const { Schema } = mongoose


const notificationSchema = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'comment_post', // ai đó comment bài viết của mình
      'reply_comment', // ai đó trả lời comment của mình
      'like_post', // ai đó like bài viết của mình
      'like_comment' // ai đó like comment của mình
    ],
    required: true
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },

  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type:Boolean,
    default: true
  }
}, { collection: 'notifications', timestamps: true } )

const notificationModel = mongoose.model('Notification', notificationSchema)

export default notificationModel