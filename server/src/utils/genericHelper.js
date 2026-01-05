import { JSDOM } from 'jsdom'
import ApiError from './ApiError'
import { StatusCodes } from 'http-status-codes'

export const extractMediaUrls = (html) => {
  const dom = new JSDOM(html)
  const imgs = dom.window.document.querySelectorAll('img')
  return [...imgs].map(img => img.src)
}

export const toggleActiveById = async (model, id, name) => {
  const doc = await model.findById({ _id: id })
  if (!doc) throw new ApiError(StatusCodes.NOT_FOUND, `${name} not found!`)

  doc.isActive = !doc.isActive

  return doc.save()
}