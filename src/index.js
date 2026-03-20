import { startSocket } from './core/socket.js'
import { handleMessage } from './handlers/messageHandler.js'

const start = async () => {
  const sock = await startSocket()

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return

    await handleMessage(sock, msg)
  })
}

start()