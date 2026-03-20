import { exec } from 'child_process'

export function preprocessVideo(input, output) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -y -fflags +genpts -i "${input}" -vf "fps=15,scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos,format=yuv420p" -c:v libwebp -preset default -an -vsync 0 -movflags +faststart "${output}"`

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(output)
    })
  })
}