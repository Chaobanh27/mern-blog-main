import mongoose from 'mongoose'

const { Schema } = mongoose

const likeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  targetType: {
    type: String,
    required: true,
    enum: ['post', 'comment'],
    index: true
  }
}, { collection: 'likes', timestamps: true })


//áp dụng compound unique index để không cho cùng 1 user like cùng 1 post hoặc 1 cmt 2 lần
likeSchema.index(
  { userId: 1, targetId: 1, targetType: 1 },
  { unique: true }
)

const likeModel = mongoose.model('Like', likeSchema)

export default likeModel