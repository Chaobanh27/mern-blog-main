/* eslint-disable no-console */
import { Server } from 'socket.io'

let io

// hàm để triển khai socket ở server,js
export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: '*' } })

  io.on('connection', (socket) => {
    console.log('user connected: ', socket.id)

    socket.on('join', userId => {
      socket.join(userId)
      console.log('user joined room:', userId)
    })
  })

  console.log('✅ Socket.io initialized')
  return io
}

// Hàm để lấy io ở nơi khác (controller, service)
export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!')
  return io
}
