import fs from 'fs'
import { downloadMedia } from '../utils/media.js'
import { videoToSticker } from '../utils/videoToSticker.js'
import { Sticker } from 'wa-sticker-formatter'

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
    type = 'video'
  } else if (quoted?.imageMessage) {
    target = { message: quoted }
    type = 'image'
  } else if (quoted?.videoMessage) {
    target = { message: quoted }
    type = 'video'
  }

  if (!target) return

  const input = `./tmp/${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`
  const output = `./tmp/${Date.now()}.webp`

  await downloadMedia(target, input)

  if (type === 'image') {
    const { imageToSticker } = await import('../utils/videoToSticker.js')
    await imageToSticker(input, output)
  } else {
    await videoToSticker(input, output)
  }

  const buffer = fs.readFileSync(output)

  const author = `Dono: matrizz | Autor: ${message.pushName || 'user'} | Github: github.com/matrizz`
  const pack = `Bot Litrizz V6`

  const sticker = new Sticker(buffer, {
    pack,
    author,
    type: 'full',
    quality: 100
  })

  const stickerBuffer = await sticker.toBuffer()

  await sock.sendMessage(message.key.remoteJid, {
    sticker: stickerBuffer
  })

  fs.unlinkSync(input)
  fs.unlinkSync(output)
}