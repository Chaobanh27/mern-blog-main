/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import commentModel from '~/models/commentModel'
import likeModel from '~/models/likeModel'
import notificationModel from '~/models/notificationModel'
import postModel from '~/models/postModel'
import userModel from '~/models/userModel'
import { getIO } from '~/sockets'
import ApiError from '~/utils/ApiError'

const toggleLike = async (userId, reqBody) => {
  try {
    const { targetId, targetType } = reqBody
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const existLike = await likeModel.findOne({ userId, targetId, targetType })

    if (!existLike) {
      await likeModel.create({
        userId: userId,
        targetId: targetId,
        targetType: targetType
      })

      if (targetType === 'post') {
        const post = await postModel.findOne({ _id: targetId })
        await postModel.findByIdAndUpdate(targetId, {
          $inc: { likesCount: 1 },
          $push: { likes: userId }
        })

        if (post?.author?.toString() !== userId) {
          //tạo notification và lưu vào DB
          await notificationModel.create({
            userId: post?.author,
            senderId: userId,
            type: 'like_post',
            postId: targetId
          })

          //xử lý real time thông báo đến chủ bài post
          getIO().to(post?.author?.toString()).emit('notification', {
            type: 'like_post',
            postId: targetId,
            senderId: existUser,
            message: 'đã thích bài viết',
            createdAt: Date.now()
          })
        }

      } else {
        await commentModel.findByIdAndUpdate(targetId, {
          $inc: { likesCount: 1 },
          $push: { likes: userId }
        })
      }
      return { liked: true }
    }

    await likeModel.findByIdAndDelete(existLike._id)
    if (targetType === 'post') {
      await postModel.findByIdAndUpdate(targetId, {
        $inc: { likesCount: -1 },
        $pull: { likes: userId }

      })
    } else {
      await commentModel.findByIdAndUpdate(targetId, {
        $inc: { likesCount: -1 },
        $pull: { likes: userId }

      })
    }

    return { liked: false }
  } catch (error) {
    throw error
  }
}

export const likeService = {
  toggleLike
}