/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import bookmarkModel from '~/models/bookmarkModel'
import commentModel from '~/models/commentModel'
import likeModel from '~/models/likeModel'
import postModel from '~/models/postModel'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const getDashboardOverview = async (userId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const now = new Date()
    const startOfToday = new Date (now.getFullYear(), now.getMonth(), now.getDay())

    const sevenDaysAgo = new Date(startOfToday)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

    const endWeekB = new Date(startOfToday)
    endWeekB.setDate(sevenDaysAgo.getDate() - 7)

    const startWeekB = new Date(startOfToday)
    startWeekB.setDate(startOfToday - 13)


    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      totalBookmarks,
      newUsersToday,
      newPostsToday,
      postsLast7Days,
      postsPrevious7Days,
      usersLast7Days,
      topPostsByLikes,
      topTags
    ] = await Promise.all([
      userModel.countDocuments(),
      postModel.countDocuments(),
      commentModel.countDocuments(),
      likeModel.countDocuments({ targetType: 'post' }),
      bookmarkModel.countDocuments(),

      userModel.countDocuments({ createdAt: { $gte: startOfToday } }),
      postModel.countDocuments({ createdAt: { $gte: startOfToday } }),


      //số post 7 ngày gần nhất (group theo ngày)
      postModel.aggregate([
        //tìm dữ liệu được tạo từ 7 ngày trước đến hiện tại
        {
          $match: { createdAt: { $gte: sevenDaysAgo, $lte: now } }
        },

        //nhóm dữ liệu theo createdAt và đếm tổng số post theo thời gian đó
        {
          $group: {
            _id: {
              $dateToString: { date: '$createdAt', format: '%Y-%m-%d' }
            },
            count: { $sum: 1 }
          }
        },

        //sắp xếp tăng dần
        {
          $sort: { _id: 1 }
        }
      ]),

      //số post 7 ngày trước đó (group theo ngày)
      postModel.aggregate([
        //tìm dữ liệu được tạo từ 7 ngày trước đến hiện tại
        {
          $match: { createdAt: { $gte: startWeekB, $lte: endWeekB } }
        },

        //nhóm dữ liệu theo createdAt và đếm tổng số post theo thời gian đó
        {
          $group: {
            _id: {
              $dateToString: { date: '$createdAt', format: '%Y-%m-%d' }
            },
            count: { $sum: 1 }
          }
        },

        //sắp xếp tăng dần
        {
          $sort: { _id: 1 }
        }
      ]),

      //số user 7 ngày gần nhất (group theo ngày)
      userModel.aggregate([
        //tìm dữ liệu được tạo từ 7 ngày trước đến hiện tại
        {
          $match: { createdAt: { $gte: sevenDaysAgo, $lte: now } }
        },

        //
        {
          $group: {
            _id: {
              $dateToString: { date: '$createdAt', format: '%Y-%m-%d' }
            },
            count: { $sum: 1 }
          }
        },

        //sắp xếp tăng dần
        {
          $sort: { _id: 1 }
        }
      ]),

      // top bài viết theo số like
      postModel.aggregate([
        { $sort: { likesCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorUser'
          }
        },
        { $unwind: '$authorUser' },
        {
          $project: {
            _id: 1,
            title: 1,
            likesCount: 1,
            views: 1,
            createdAt: 1,
            'authorUser._id' : 1,
            'authorUser.username': 1
          }
        }
      ]),

      // top tag sử dụng nhiều nhất
      postModel.aggregate([
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            postCount: { $sum: 1 }
          }
        },
        { $sort: { postCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'tags',
            localField: '_id',
            foreignField: '_id',
            as: 'tag'
          }
        },
        { $unwind: '$tag' },
        {
          $project: {
            _id: 0,
            tagId: '$_id',
            name: '$tag.name',
            postCount: 1
          }
        }
      ])
    ])

    let percentChange = 0

    if ( postsPrevious7Days === 0) {
      percentChange = postsLast7Days > 0 ? 100 : 0
    } else {
      percentChange = ((postsLast7Days - postsPrevious7Days ) / postsPrevious7Days) * 100
    }

    percentChange = Math.round(percentChange * 100) / 100


    const results = {
      summary: {
        totalUsers,
        totalPosts,
        totalComments,
        totalLikes,
        totalBookmarks,
        newUsersToday,
        newPostsToday,
        percentChange
      },
      charts: {
        postsLast7Days,
        usersLast7Days
      },
      top: {
        topPostsByLikes,
        topTags
      }
    }

    return results
  } catch (error) {
    throw error
  }
}


export const dashboardService = {
  getDashboardOverview
}