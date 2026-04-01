import { exec } from 'child_process'

export function imageToSticker(input, output) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -vcodec libwebp -lossless 1 -qscale 100 -preset default -an -vsync 0 "${output}"`

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(output)
    })
  })
}

export function videoToSticker(input, output) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -y -i "${input}" -vf "fps=12,scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos,setsar=1,format=rgba" -c:v libwebp -lossless 0 -q:v 60 -loop 0 -an "${output}"`;

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(output)
    })
  })
}