import express from 'express'
import { tagController } from '~/controllers/tagController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, tagController.createNew)
  .get(tagController.getTags)


export const tagRoute = Router