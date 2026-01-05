/* eslint-disable no-useless-catch */
import tagModel from '~/models/tagModel'

const createNew = async () => {}

const getTags = async () => {
  try {
    const tags = await tagModel.find()
    return tags
  } catch (error) {
    throw error
  }
}

export const tagServices = {
  createNew,
  getTags
}