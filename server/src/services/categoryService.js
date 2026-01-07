/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import categoryModel from '~/models/categoryModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { toggleActiveById } from '~/utils/genericHelper'


const createNew = async (userId, reqBody) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const { name } = reqBody
    if (!name) throw new ApiError(StatusCodes.NOT_FOUND, 'Name not found!')

    const slug = slugify(name)
    const newCategory = await categoryModel.create({
      name: name,
      slug: slug
    })

    return newCategory._doc
  } catch (error) {
    throw error
  }
}

const getCategories = async (reqQuery) => {
  try {

    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const skip = (page - 1) * limit

    const [categories, totalCategories] = await Promise.all([
      categoryModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      categoryModel.countDocuments()
    ])

    const totalPages = Math.ceil(totalCategories / limit)

    return {
      data: categories,
      totalCategories,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

const toggleActive = async (userId, categoryId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const result = toggleActiveById(categoryModel, categoryId, 'category')

    return result
  } catch (error) {
    throw error
  }
}

export const categoryService = {
  createNew,
  getCategories,
  toggleActive
}