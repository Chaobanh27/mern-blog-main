import mongoose from 'mongoose'
import validator from 'validator'

const { Schema } = mongoose

const postSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    min: [3, 'Title should contain at least 3 characters!']
  },
  slug: {
    type: String,
    lowerCase: true,
    required: true,
    unique: true,
    validate: {
      validator: str => validator.isSlug(str),
      message: 'Slug is not valid'
    }
  },
  content: {
    type: String,
    required: true
  },
  coverImage:{
    type: String
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    }
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
  category:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
  status: {
    type:String,
    enum: ['published', 'unpublished'],
    default: 'unpublished'
  },
  likesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type:Boolean,
    default: true
  }
}, { collection: 'posts', timestamps: true })

const postModel = mongoose.model('Post', postSchema)

export default postModel