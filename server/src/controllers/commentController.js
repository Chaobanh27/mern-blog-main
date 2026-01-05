import { StatusCodes } from 'http-status-codes'
import { commentService } from '~/services/commentService'


const createNew = async (req, res, next) => {
  try {
    const { content, postId } = req.body
    const userId = req.jwtDecoded._id
    const result = await commentService.createNew(postId, content, userId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const createReply = async (req, res, next) => {
  try {
    const { replyContent, parentCommentId } = req.body
    const userId = req.jwtDecoded._id
    const result = await commentService.createReply(parentCommentId, replyContent, userId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const userId = req.jwtDecoded?._id
    const result = await commentService.getCommentsByPost(postId, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getComments = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id
    const reqQuery = req.query
    const result = await commentService.getComments(userId, reqQuery)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }


}

const update = async (req, res, next) => {
  try {
    const { commentId } = req.params
    const userId = req.jwtDecoded?._id
    const { content, postId } = req.body
    const result = await commentService.update(commentId, postId, userId, content)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const toggleActive = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { commentId } = req.params
    const result = await commentService.toggleActive(userId, commentId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const commentController = {
  createNew,
  update,
  createReply,
  getCommentsByPost,
  getComments,
  toggleActive
}