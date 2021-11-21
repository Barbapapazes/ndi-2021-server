import Ws from 'App/Services/Ws'
import User from 'App/Models/User'
import Message from 'App/Models/Message'
Ws.boot()

Ws.io.use(async (socket, next) => {
  const messagingToken = socket.handshake.auth.token

  // Find user using messaging token
  const user = await User.findByOrFail('messagingToken', messagingToken)
  await user.load('profile')
  // Attach user to socket
  // @ts-ignore
  socket.user = user

  next()
})

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', async (socket) => {
  // @ts-ignore
  socket.join(socket.user.id)

  // Create a list of all connected users
  const users: Array<{ id: number; pseudo: string }> = []
  for (let [id, userSocket] of Ws.io.of('/').sockets) {
    users.push({
      // @ts-ignore
      id: userSocket.user.id,
      // @ts-ignore
      pseudo: userSocket.user.profile.pseudo,
    })
  }
  // Send list of connected users to the new user
  socket.emit('users', users)

  // Tell all users that a new user has joined
  socket.broadcast.emit('user connected', {
    // @ts-ignore
    id: socket.user.id,
    // @ts-ignore
    pseudo: socket.user.profile.pseudo,
  })

  socket.on('private message', async ({ content, to }, callback) => {
    const message = await Message.create({
      text: content,
      // @ts-ignore
      fromId: socket.user.id,
      toId: to,
    })
    await message.load('from')
    callback(message)
    // @ts-ignore
    socket.to(to).to(socket.user.id).emit('private message', {
      content: message,
      // @ts-ignore
      from: socket.user.id,
    })
  })

  socket.on('disconnect', async () => {
    //  @ts-ignore
    const matchingSockets = await Ws.io.in(socket.user.id).allSockets()
    const isDisconnected = matchingSockets.size === 0
    if (isDisconnected) {
      // notify other users
      //  @ts-ignore
      socket.broadcast.emit('user disconnected', socket.user.id)
    }
  })
})
