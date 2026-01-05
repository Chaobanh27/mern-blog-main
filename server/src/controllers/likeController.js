import { StatusCodes } from 'http-status-codes'
import { likeService } from '~/services/likeService'

const toggleLike = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await likeService.toggleLike(userId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const likeController = {
  toggleLike
}

