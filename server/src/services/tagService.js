/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import tagModel from '~/models/tagModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (userId, reqBody) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const { name } = reqBody
    if (!name) throw new ApiError(StatusCodes.NOT_FOUND, 'Name not found!')

    const slug = slugify(name)
    const newTag = await tagModel.create({
      name: name,
      slug: slug
    })

    return newTag._doc
  } catch (error) {
    throw error
  }
}

const getTags = async (reqQuery) => {
  try {
    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const skip = (page - 1) * limit

    const [tags, totalTags] = await Promise.all([
      tagModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      tagModel.countDocuments()
    ])

    const totalPages = Math.ceil(totalTags / limit)

    return {
      data: tags,
      totalTags,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

export const tagServices = {
  createNew,
  getTags
}