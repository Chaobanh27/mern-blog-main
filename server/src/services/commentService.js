/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import commentModel from '~/models/commentModel'
import likeModel from '~/models/likeModel'
import postModel from '~/models/postModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { toggleActiveById } from '~/utils/genericHelper'


const createNew = async (postId, content, userId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const newComment = await commentModel.create({
      postId: postId,
      userId: userId,
      content: content
    })

    const result = await commentModel.findById(newComment._doc._id).populate('userId')

    return result
  } catch (error) {
    throw error
  }
}

const update = async (commentId, postId, userId, content) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    const existPost = await postModel.findOne({ _id: postId })
    const existComment = await commentModel.findOne({ _id: commentId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    if (!existPost) throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found!')
    if (!existPost.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your post is not active!')

    if (!existComment) throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found!')
    if (!existComment.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your comment is not active!')

    const editedComment = await commentModel.findByIdAndUpdate(
      { _id: commentId },
      {
        content: content
      },
      { new: true }
    )

    return editedComment

  } catch (error) {
    throw error
  }
}

const createReply = async (parentCommentId, replyContent, userId) => {
  // console.log('parentCommentId', parentCommentId)
  // console.log('replyContent', replyContent)
  // console.log('userId', userId)
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const parentComment = await commentModel.findById(parentCommentId)
    if (!parentComment) throw new ApiError(StatusCodes.NOT_FOUND, 'Comment not found!')

    const newReplyComment = await commentModel.create({
      postId: parentComment.postId,
      userId: userId,
      content: replyContent,
      parentCommentId: parentCommentId
    })

    const result = await commentModel.findById(newReplyComment._doc._id).populate('userId')


    return result

  } catch (error) {
    throw error
  }
}

const getCommentsByPost = async (postId, userId) => {
  try {

    let result = []
    const comments = await commentModel.find({ postId: postId, isActive: true })
    const parentComments = await commentModel.find({ postId: postId, parentCommentId: null, isActive:true })
      .populate({
        path: 'userId',
        select: 'username avatar email'
      })
      .sort({ createdAt: -1 })
      .lean()


    const replies = await commentModel.find({ postId: postId, parentCommentId: { $ne: null }, isActive: true })
      .populate({
        path: 'userId',
        select: 'username avatar email'
      })
      .lean()

    const replyMap = {}
    replies.forEach(r => {
      if (!replyMap[r.parentCommentId]) replyMap[r.parentCommentId] = []
      replyMap[r.parentCommentId].push(r)
    })

    const likes = await likeModel.find({
      userId,
      targetType: 'comment',
      targetId: { $in: comments.map(c => c._id) }
    })

    const likedSet = new Set(likes.map(l => l.targetId.toString()))

    if (!userId) {
      result = parentComments.map(c => ({
        ...c,
        isLiked: false,
        replies: replyMap[c._id]?.map(r => ( { ...r, isLiked: false }) ) || []
      }))
      return result
    }

    result = parentComments.map(c => ({
      ...c,
      isLiked: likedSet.has(c._id.toString()),
      replies: replyMap[c._id]?.map(r => (
        {
          ...r,
          isLiked: likedSet.has(r._id.toString())
        }
      ) ) || []
    }))

    return result
  } catch (error) {
    throw error
  }
}

const getComments = async (userId, reqQuery) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const skip = (page - 1) * limit

    const [comments, totalComments] = await Promise.all([
      commentModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(
          {
            path: 'userId',
            select: 'username avatar email'
          }
        ),
      commentModel.countDocuments()
    ])

    const totalPages = Math.ceil(totalComments / limit)

    return {
      data: comments,
      totalComments,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    throw error
  }
}

const toggleActive = async (userId, commentId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const result = toggleActiveById(commentModel, commentId, 'comment')

    return result
  } catch (error) {
    throw error
  }
}

export const commentService = {
  createNew,
  update,
  createReply,
  getCommentsByPost,
  getComments,
  toggleActive
}