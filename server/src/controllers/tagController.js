import { StatusCodes } from 'http-status-codes'
import { tagServices } from '~/services/tagService'


const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await tagServices.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}


const getTags = async (req, res, next) => {
  try {
    const result = await tagServices.getTags(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const tagController = {
  createNew,
  getTags
}