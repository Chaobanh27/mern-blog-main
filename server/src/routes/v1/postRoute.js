import express from 'express'
import { postController } from '~/controllers/postController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()


Router.route('/create-draft')
  .post(authMiddleware.isAuthorized, postController.createNewDraft)

Router.route('/upload-media-content')
  .post(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('file'),
    postController.uploadContentMedia
  )
Router.route('/')
  .post(authMiddleware.isAuthorized, postController.createNew)
  .get(postController.getPosts)

Router.route('/search')
  .get(postController.search)

Router.route('/generate-content')
  .post( authMiddleware.isAuthorized, postController.generateContent)

Router.route('/bookmarks')
  .get(authMiddleware.isAuthorized, postController.getBookmarks)

Router.route('/related-posts/')
  .get(postController.getRelatedPosts)

Router.route('/:postId')
  .get(authMiddleware.isOptional, postController.getPost)
  .put(authMiddleware.isAuthorized, postController.update)
  .patch(authMiddleware.isAuthorized, postController.toggleActive )

Router.route('/:postId/bookmark/')
  .post(authMiddleware.isAuthorized, postController.toggleBookmark)

export const postRoute = Router