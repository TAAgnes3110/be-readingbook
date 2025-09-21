const userSocket = require('./userSocket')

const initializeSockets = (io) => {
  // Initialize socket middleware
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId
    if (!userId) {
      return next(new Error('Invalid user ID'))
    }
    socket.userId = userId
    next()
  })

  // Initialize user sockets
  userSocket(io)
}

module.exports = initializeSockets
