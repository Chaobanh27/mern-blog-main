import mongoose from 'mongoose'
import validator from 'validator'

const { Schema } = mongoose

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: str => validator.isSlug(str),
      message: 'Slug is not valid'
    }
  },
  isActive: {
    type:Boolean,
    default: true
  }
}, { collection: 'categories', timestamps: true })

const categoryModel = mongoose.model('Category', categorySchema)

export default categoryModel