/* eslint-disable no-useless-catch */

import { StatusCodes } from 'http-status-codes'
import notificationModel from '~/models/notificationModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const getNotificationsByUser = async (userId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const list = await notificationModel.find({ userId: userId })
      .populate(
        {
          path: 'senderId',
          select: 'username avatar email'
        }
      )
      .sort({ createdAt: -1 })

    return list
  } catch (error) {
    throw error
  }
}

const markAllRead = async (userId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    await notificationModel.updateMany(
      { userId: userId, isRead: false },
      { $set: { isRead: true } }
    )

    const updatedNotifications = await notificationModel.find({ userId: userId }) .populate(
      {
        path: 'senderId',
        select: 'username avatar email'
      }
    )
      .sort({ createdAt: -1 })

    return updatedNotifications
  } catch (error) {
    throw error
  }
}

export const notificationService = {
  getNotificationsByUser,
  markAllRead
}