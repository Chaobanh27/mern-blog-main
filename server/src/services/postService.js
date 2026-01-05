/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import bookmarkModel from '~/models/bookmarkModel'
import likeModel from '~/models/likeModel'
import mediaModel from '~/models/mediaModel'
import postModel from '~/models/postModel'
import userModel from '~/models/userModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { extractMediaUrls, toggleActiveById } from '~/utils/genericHelper'
import { slugify } from '~/utils/formatters'

const createNewDraft = async () => {
  const draftId = uuidv4()

  //

  return draftId
}

const createNew = async (userId, reqBody) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const { title, category, tags, content, coverImage } = reqBody
    const slug = slugify(title)

    const tagsIds = tags.map(tag => tag.value)

    const urls = extractMediaUrls(content)

    const mediaDocs = await mediaModel.find({ url: { $in: urls } })

    const newPost = await postModel.create({
      author: userId,
      title: title,
      slug: slug,
      category: category.value,
      tags: tagsIds,
      content: content,
      coverImage: coverImage,
      media: mediaDocs.map(m => m._id)
    })

    await mediaModel.updateMany(
      { _id: { $in: mediaDocs.map(m => m._id) } },
      { postId: newPost._id }
    )

    return newPost._doc
  } catch (error) {
    throw error
  }
}

const update = async (userId, postId, reqBody) => {
  try {
    const { title, content, categoryId, tags, coverImage } = reqBody

    const existUser = await userModel.findOne({ _id: userId })
    const existPost = await postModel.findOne({ _id: postId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!existPost) throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found!')


    let updatedPost = {}
    let mediaDocs = []

    if (coverImage !== undefined) {
      updatedPost.coverImage = coverImage
    }

    if (title !== undefined) {
      updatedPost.title = title
      updatedPost.slug = slugify(title)
    }

    if (content !== undefined) {
      updatedPost.content = content
      const urls = extractMediaUrls(content)
      mediaDocs = await mediaModel.find({ url: { $in: urls } })
    }

    if (categoryId !== undefined) {
      updatedPost.categoryId = categoryId
    }

    if (tags !== undefined) {
      updatedPost.tags = tags
    }

    if (Object.keys(updatedPost).length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No data to update!')
    }

    const result = await postModel.findByIdAndUpdate(
      { _id: postId },
      { $set: updatedPost },
      { new: true }
    )

    await mediaModel.updateMany(
      { _id: { $in: mediaDocs.map(m => m._id) } },
      { postId: postId }
    )

    return result

  } catch (error) { throw error }
}

const search = async (reqQuery) => {
  try {
    const { q } = reqQuery

    if (!q || !q.trim()) {
      return []
    }

    const regex = new RegExp(q, 'i')

    const result = await postModel.aggregate([
      {
        $match: {
          isActive: true
        }
      },
      {
        $lookup: {
          from : 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },

      {
        $unwind: '$author'
      },
      {
        $match: {
          $or: [
            { title: regex },
            { 'author.username': regex }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          coverImage: 1,
          title: 1,
          slug: 1,
          author: {
            _id: '$author._id',
            name: '$author.username',
            avatar: '$author.avatar'
          }
        }
      }
    ])


    return result
  } catch (error) {
    throw error
  }
}

const uploadContentMedia = async (userId, draftId, file) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!file) throw new ApiError(StatusCodes.NOT_FOUND, 'File not found!')

    // Upload lên Cloudinary
    const result = await CloudinaryProvider.streamUpload(file.buffer, 'blog')

    // Lưu vào DB
    const media = await mediaModel.create({
      uploaderId: userId,
      url: result.secure_url,
      publicId: result.public_id,
      type: result.resource_type === 'video' ? 'video' : 'image',
      mimeType: file.mimetype,
      draftId: draftId,
      postId: null,
      isTemp: true,
      size: result.bytes
    })

    return media
  } catch (error) {
    throw error
  }
}

const getPosts = async (reqQuery) => {
  try {

    const currentPage = parseInt(reqQuery.currentPage) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const skip = (currentPage - 1) * limit

    const search = reqQuery.search || ''
    const catogery = reqQuery.category || ''
    const tag = reqQuery.tag || []
    const sortBy = reqQuery.sortBy || 'createdAt'
    const order = reqQuery.order === 'asc' ? 1 : -1

    const tagsArr = []

    if (tag.length > 0) {
      tag.forEach(element => {
        const objId = new mongoose.Types.ObjectId(element.value)
        tagsArr.push(objId)
      })
    }

    let filter = {}

    if (catogery) {
      filter.category = new mongoose.Types.ObjectId(catogery)
    }

    if (tagsArr.length > 0) {
      filter.tags = { $all: tagsArr }
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' }
    }

    const total = await postModel.countDocuments(filter)

    const posts = await postModel
      .find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate(
        [
          {
            path: 'author',
            select: 'username avatar email'
          },
          {
            path: 'category'
          },
          {
            path: 'tags'
          }
        ]
      )
    return {
      posts,
      totalPages: Math.ceil( total / limit),
      currentPage: currentPage,
      total
    }
  } catch (error) {
    throw error
  }
}

const getPost = async (postId, userId) => {
  try {
    let result = {}
    const post = await postModel.findOne({ _id: postId }).populate(
      {
        path: 'author',
        select: 'username avatar email'
      }
    )

    if (!post) throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found!')

    if (!userId) {
      result = {
        ...post?.toObject(),
        isBookmarked: false,
        isLiked: false
      }
      return result
    }

    const existLike = await likeModel.findOne({
      userId: userId,
      targetId: postId,
      targetType: 'post'
    })
    const existBookmark = await bookmarkModel.findOne({
      userId: userId,
      postId: postId
    })
    result = {
      ...post?.toObject(),
      isBookmarked: existBookmark ? true : false,
      isLiked: existLike ? true : false
    }
    return result
  } catch (error) {
    throw error
  }
}

const toggleBookmark = async (userId, postId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const existPost = await postModel.findOne({ _id: postId })
    if (!existPost) throw new ApiError(StatusCodes.NOT_FOUND, 'Post not found!')

    const existBookmark = await bookmarkModel.findOne({ userId: userId, postId: postId })

    if (!existBookmark) {
      await bookmarkModel.create({
        userId: userId,
        postId: postId
      })
      return { isBookmarked: true }

    }

    await bookmarkModel.findByIdAndDelete(existBookmark._id)
    return { isBookmarked: false }

  } catch (error) {
    throw error
  }
}

const getBookmarks = async (userId, reqQuery) => {
  try {
    const { search, category, tag, sortBy = 'createdAt', sortOrder = 'desc' } = reqQuery
    const existUser = await userModel.findOne({ _id: userId })

    const currentPage = parseInt(reqQuery.currentPage) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const skip = (currentPage - 1) * limit

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const bookmarks = await bookmarkModel.find({ userId: userId }).populate('postId')

    const postIds = bookmarks.map(b => b.postId)

    const filter = { _id: { $in: postIds } }

    const tagsArr = []

    if (tag?.length > 0) {
      tag?.forEach(element => {
        const objId = new mongoose.Types.ObjectId(element.value)
        tagsArr.push(objId)
      })
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' }
    }
    if (category) {
      filter.category = new mongoose.Types.ObjectId(category)
    }

    if (tagsArr.length > 0) {
      filter.tags = { $all: tagsArr }
    }


    const posts = await postModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .populate(
        [
          {
            path: 'author',
            select: 'username avatar email'
          },
          {
            path: 'category'
          },
          {
            path: 'tags'
          }
        ]
      )

    const total = posts.length

    return {
      posts,
      totalPages: Math.ceil( total / limit),
      currentPage: currentPage,
      total
    }
  } catch (error) {
    throw error
  }
}

const getRelatedPosts = async (reqQuery) => {
  try {
    const { currentPostId, categoryId } = reqQuery
    const relatedPosts = await postModel.find({
      _id: { $ne: new mongoose.Types.ObjectId(currentPostId) },
      category:  new mongoose.Types.ObjectId(categoryId)
    })
      .limit(6)
      .sort({ createdAt: -1 })
      .populate( [
        {
          path: 'author',
          select: 'username avatar email'
        },
        {
          path: 'category'
        },
        {
          path: 'tags'
        }
      ])

    return relatedPosts
  } catch (error) {
    throw error
  }
}

const toggleActive = async (userId, postId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    const result = toggleActiveById(postModel, postId, 'post')

    return result
  } catch (error) {
    throw error
  }
}


export const postService = {
  createNewDraft,
  createNew,
  update,
  search,
  uploadContentMedia,
  getPosts,
  getPost,
  toggleBookmark,
  getBookmarks,
  getRelatedPosts,
  toggleActive
}