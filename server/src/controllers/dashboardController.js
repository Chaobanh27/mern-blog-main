import { StatusCodes } from 'http-status-codes'
import { dashboardService } from '~/services/dashboardService'

const getDashboardOverview = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await dashboardService.getDashboardOverview(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const dashboardController = {
  getDashboardOverview
}