import { StatusCodes } from 'http-status-codes'
import main from '~/config/gemini'
import { postService } from '~/services/postService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await postService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { postId } = req.params
    const result = await postService.update(userId, postId, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const createNewDraft = async (req, res, next) => {
  try {
    const result = await postService.createNewDraft()
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const uploadContentMedia = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const draftId = req.body.draftId
    const file = req.file // nếu dùng multer, file nằm trong req.file

    const result = await postService.uploadContentMedia(userId, draftId, file)

    // Trả về URL cho TinyMCE
    res.status(StatusCodes.OK).json({ url: result.url })

  } catch (error) {
    next(error)
  }
}

const getPosts = async (req, res, next) => {
  try {
    const result = await postService.getPosts(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params
    const userId = req.jwtDecoded?._id || null
    const result = await postService.getPost(postId, userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const search = async (req, res, next) => {
  try {
    const result = await postService.search(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const toggleBookmark = async (req, res, next) => {
  try {
    const { postId } = req.params
    const userId = req.jwtDecoded?._id
    const result = await postService.toggleBookmark(userId, postId)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await postService.getBookmarks(userId, req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getRelatedPosts = async (req, res, next) => {
  try {
    const result = await postService.getRelatedPosts(req.query)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const generateContent = async (req, res, next) => {
  try {
    const { prompt } = req.body
    const content = await main(prompt + ' Generate a blog content for this topic in simple text format')
    res.status(StatusCodes.OK).json(content)
  } catch (error) {
    next(error)
  }
}

const toggleActive = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { postId } = req.params
    const result = await postService.toggleActive(userId, postId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


export const postController = {
  createNew,
  update,
  search,
  createNewDraft,
  uploadContentMedia,
  getPosts,
  getPost,
  toggleBookmark,
  getBookmarks,
  getRelatedPosts,
  generateContent,
  toggleActive
}