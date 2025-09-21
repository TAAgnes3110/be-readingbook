const UserProvider = require('../providers/userProvider')

const userSocket = (io) => {
  const userNamespace = io.of('/users')

  userNamespace.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId

    // Handle user connection
    socket.on('user:connect', async () => {
      socket.join(`user:${userId}`)
      await UserProvider.updateUserStatus(userId, true)
    })

    // Listen to user changes
    UserProvider.listenToUserChanges(userId, (userData) => {
      socket.emit('user:updated', userData)
    })

    // Handle user disconnect
    socket.on('disconnect', async () => {
      socket.leave(`user:${userId}`)
      await UserProvider.updateUserStatus(userId, false)
      await UserProvider.stopListening(userId)
    })

    // Handle real-time status updates
    socket.on('user:typing', (data) => {
      socket.to(`user:${data.targetUserId}`).emit('user:typing', {
        userId: userId,
        isTyping: data.isTyping
      })
    })
  })
}

module.exports = userSocket
