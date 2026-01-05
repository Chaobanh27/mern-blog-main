import { StatusCodes } from 'http-status-codes'
import { tagServices } from '~/services/tagService'


const createNew = async (req, res, next) => {
  try {
    //
  } catch (error) {
    next(error)
  }
}


const getTags = async (req, res, next) => {
  try {
    const result = await tagServices.getTags()
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const tagController = {
  createNew,
  getTags
}