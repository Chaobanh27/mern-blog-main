import mongoose from 'mongoose'
import validator from 'validator'

const { Schema } = mongoose

const mediaSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  draftId: {
    type:String,
    default: null
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicId:{
    type: String,
    required: true
  },
  url:{
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: 'url media is not valid'
    }
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image'
  },
  mimeType: {
    type: String,
    required: true,
    enum: [
      'image/jpeg', 'image/png', 'image/jpg', 'video/mp4'
    ],
    validate: {
      validator: str => validator.isMimeType(str),
      message: props => `${props.value} không phải là mimeType hợp lệ!`
    }
  },

  size: {
    type: Number, // tính bằng bytes
    required: true,
    min: [1, 'File phải lớn hơn 0 bytes'],
    max: [20 * 1024 * 1024, 'File vượt quá 20MB']
  },
  isTemp:{
    type:Boolean,
    default: true
  },
  isActive: {
    type:Boolean,
    default: true
  }
}, { collection: 'media', timestamps: true })

const mediaModel = mongoose.model('Media', mediaSchema)

export default mediaModel