import { StatusCodes } from 'http-status-codes'
import { categoryService } from '~/services/categoryService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await categoryService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getCategories = async (req, res, next) => {
  try {
    const result = await categoryService.getCategories(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const toggleActive = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { categoryId } = req.params
    const result = await categoryService.toggleActive(userId, categoryId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const categoryController = {
  createNew,
  getCategories,
  toggleActive
}