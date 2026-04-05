import fs from 'fs'
import { downloadMedia } from '../utils/media.js'
import { toSticker } from '../utils/videoToSticker.js'
import { addStickerMeta } from '../utils/stickerMetadata.js'

export async function stickerCommand(sock, message) {
  const msg = message.message

  const isImage = msg?.imageMessage
  const isVideo = msg?.videoMessage
  const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage

  let target = null
  let type = null

  if (isImage) {
    target = message
    type = 'image'
  } else if (isVideo) {
    target = message
    type = msg.videoMessage.gifPlayback ? 'gif' : 'video'
  } else if (quoted?.imageMessage) {
    target = { message: quoted }
    type = 'image'
  } else if (quoted?.videoMessage) {
    target = { message: quoted }
    type = quoted.videoMessage.gifPlayback ? 'gif' : 'video'
  }

  if (!target) return

  const ext = type === 'image' ? 'jpg' : type === 'sticker' ? 'webp' : 'mp4'
  const input = `./tmp/${Date.now()}.${ext}`
  const output = `./tmp/${Date.now()}.webp`

  try {
    await downloadMedia(target, input, sock)
    await toSticker(input, output, type)
    addStickerMeta(output, {
      pack: 'Bot Litrizz V6',
      author: `Dono: matrizz | Autor: ${message.pushName || 'user'} | Github: github.com/matrizz`,
    })

    const buffer = fs.readFileSync(output)

    await sock.sendMessage(message.key.remoteJid, { sticker: buffer })
  } catch (err) {
    console.error('[stickerCommand]', err)
  } finally {
    if (fs.existsSync(input)) fs.unlinkSync(input)
    if (fs.existsSync(output)) fs.unlinkSync(output)
  }
}