import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

export async function downloadMedia(msg, path) {
  const buffer = await downloadMediaMessage(
    msg,
    'buffer',
    {},
    { logger: console, reuploadRequest: undefined }
  )

  fs.writeFileSync(path, buffer)
  return path
}