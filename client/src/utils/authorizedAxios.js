import axios from 'axios'
import { toast } from 'react-toastify'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { interceptorLoadingElements } from './formatter'

let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

let authorizedAxiosInstance = axios.create()
let refreshTokenPromise = null

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use( config => {
  interceptorLoadingElements(true)
  return config
}, error => {
  return Promise.reject(error)
})


authorizedAxiosInstance.interceptors.response.use( response => {
  interceptorLoadingElements(false)
  return response
}, error => {
  interceptorLoadingElements(false)
  // if ( error.response?.status === 401) {
  //   axiosReduxStore.dispatch(logoutUserAPI(false))
  // }

  const originalRequest = error.config
  if (error.response?.status === 410 && !originalRequest._retry) {
    originalRequest._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(() => {
          //lấy accessToken mới từ BE nếu dùng local storage
        })
        .catch(() => {
          axiosReduxStore.dispatch(logoutUserAPI(false))
          // logoutUserAPI().then(() => {
          //   location.href = '/login'
          // })
          // return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
      return refreshTokenPromise.then(() => {
        return authorizedAxiosInstance(originalRequest)
      })
    }


  }

  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance