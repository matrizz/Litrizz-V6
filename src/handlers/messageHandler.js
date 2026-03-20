import { stickerCommand } from '../commands/sticker.js'

export async function handleMessage(sock, message) {
  const text = message.message?.conversation ||
    message.message?.extendedTextMessage?.text

  if (!text) return

  if (text === '.sticker') {
    await stickerCommand(sock, message)
  }
}