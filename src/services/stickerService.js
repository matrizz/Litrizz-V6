import fs from 'fs'
import { exec } from 'child_process'

export const createSticker = (input, output) => {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i ${input} -vf "scale=512:512:force_original_aspect_ratio=decrease" -vcodec libwebp -lossless 1 ${output}`

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}