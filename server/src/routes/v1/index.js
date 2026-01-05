import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/v1/userRoute'
import { logger } from '~/config/logger'
import { postRoute } from '~/routes/v1/postRoute'
import { commentRoute } from './commentRoute'
import { categoryRoute } from './categoryRoute'
import { tagRoute } from './tagRoute'
import { likeRoute } from './likeRoute'
import { notificationRoute } from './notificationRoute'
import { dashboardRoute } from './dashboardRoute'

const Router = express.Router()
/**
 * @swagger
 * /status:
 *   get:
 *     summary: kiểm tra kết nối
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Thành công
 */
Router.get('/status', (req, res) => {
  logger.info('api v1 is ready to use')
  res.status(StatusCodes.OK).json({ message: 'api v1 is ready to use' })
})

Router.use('/users', userRoute)
Router.use('/posts', postRoute)
Router.use('/comments', commentRoute)
Router.use('/categories', categoryRoute)
Router.use('/tags', tagRoute)
Router.use('/likes', likeRoute)
Router.use('/notifications', notificationRoute)
Router.use('/dashboard', dashboardRoute )


export const API_V1 = Router