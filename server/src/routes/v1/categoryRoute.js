import express from 'express'
import { categoryController } from '~/controllers/categoryController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, categoryController.createNew)
  .get(categoryController.getCategories)

Router.route('/:categoryId')
  .patch(authMiddleware.isAuthorized, categoryController.toggleActive)

export const categoryRoute = Router