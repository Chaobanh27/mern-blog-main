import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'


export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const fetchUserAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/`)
  return res.data
}

export const fetchAuthorDetailAPI = async (userId, params) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/${userId}`, { params })
  return res.data
}

export const fetchAllUsersAPI = async (params) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users`, { params })
  return res.data
}

export const fetchAllRolesAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/get-all-roles`)
  return res.data
}

export const verifyUserAPI = async (data) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return res.data
}

export const refreshTokenAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/refresh-token`)
  return res.data
}

export const get2FaQrCodeAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/users/2fa-qr-code`)
  return res.data
}

export const setup2FaAPI = async (otpToken) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/setup-2fa`, { otpToken })
  return res.data
}

export const verify2FaAPI = async (otpToken) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/verify-2fa`, { otpToken } )
  return res.data
}

export const forgotPasswordAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/forgot-password`, data)
  return res.data
}

export const resetPasswordAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/reset-password`, data)
  return res.data
}

export const createNewPostAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/posts/`, data)
  return res.data
}

export const updatePostAPI = async (postId, data) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/posts/${postId}`, data)
  return res.data
}

export const getPostsAPI = async (params) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/posts/`, { params })
  return res.data
}

export const getPostAPI = async (postId) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/posts/${postId}`)
  return res.data
}

export const searchAPI = async (query) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/posts/search?q=${query}`)
  return res.data
}

export const createDraftAPI = async () => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/posts/create-draft`)
  return res.data
}

export const uploadMediaContentAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/posts/upload-media-content`, data)
  return res.data
}

export const createNewCommentAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/comments/`, data)
  return res.data
}

export const updateCommentAPI = async (commentId, data) => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/comments/${commentId}`, data)
  return res.data
}

export const getCommentsByPostAPI = async (postId, limit, cursor) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/comments/by-post/${postId}?limit=${limit}&cursor=${cursor}`)
  return res.data
}

export const getCommentsAPI= async (currentPage, limit) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/comments?page=${currentPage}&limit=${limit}`)
  return res.data
}

export const createNewReplyAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/comments/reply`, data)
  return res.data
}

export const createNewCategoryAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/categories/`, data)
  return res.data
}

export const getCategoriesAPI = async (currentPage, limit) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/categories?page=${currentPage}&limit=${limit}`)
  return res.data
}

export const createNewTagAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/tags/`, data)
  return res.data
}

export const getTagsAPI = async (currentPage, limit) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/tags?page=${currentPage}&limit=${limit}`)
  return res.data
}

export const toggleLikeAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/likes/`, data)
  return res.data
}

export const createNewBookmarkAPI = async (postId) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/posts/${postId}/bookmark`)
  return res.data
}

export const getBookmarksAPI = async (params) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/posts/bookmarks/`, { params })
  return res.data
}

export const getRelatedPostsAPI = async (params) => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/posts/related-posts/`, { params })
  return res.data
}

export const getNotificationsAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/notifications/`)
  return res.data
}

export const markAllReadAPI = async () => {
  const res = await authorizedAxiosInstance.put(`${API_ROOT}/v1/notifications/mark-all-read`)
  return res.data
}

export const getDashboardOverviewAPI = async () => {
  const res = await authorizedAxiosInstance.get(`${API_ROOT}/v1/dashboard/`)
  return res.data
}

export const generateContentAPI = async (data) => {
  const res = await authorizedAxiosInstance.post(`${API_ROOT}/v1/posts/generate-content`, data)
  return res.data
}

export const toggleActiveById = async (name, id) => {
  const res = await authorizedAxiosInstance.patch(`${API_ROOT}/v1/${name}/${id}`)
  return res.data
}

