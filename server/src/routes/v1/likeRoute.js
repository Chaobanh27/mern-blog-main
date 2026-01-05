import express from 'express'
import { likeController } from '~/controllers/likeController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('')
  .post(authMiddleware.isAuthorized, likeController.toggleLike)

export const likeRoute = Router