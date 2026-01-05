import mongoose from 'mongoose'

const { Schema } = mongoose

const bookmarkSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, { collection: 'bookmarks', timestamps: true })

bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true })

const bookmarkModel = mongoose.model('Bookmark', bookmarkSchema)

export default bookmarkModel