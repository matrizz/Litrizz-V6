import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

export async function downloadMedia(msg, path, sock) {
  const buffer = await downloadMediaMessage(
    msg,
    'buffer',
    {},
    { logger: console, reuploadRequest: sock.updateMediaMessage }
  )

  fs.writeFileSync(path, buffer)
  return path
}