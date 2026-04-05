import { execFile } from 'child_process'
import { exec } from 'child_process'

/** @deprecated Use toSticker() **/
export function imageToSticker(input, output) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i ${input} -vf "crop='min(iw,ih)':'min(iw,ih)',scale=512:512,setsar=1" -vcodec libwebp -lossless 1 ${output}`

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(output)
    })
  })
}

/** @deprecated Use toSticker() **/
export function videoToSticker(input, output) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i ${input} -t 6 -vf "crop='min(iw,ih)':'min(iw,ih)',scale=512:512:flags=lanczos,fps=15" -c:v libwebp_anim -pix_fmt yuva420p -loop 0 -an -vsync cfr -q:v 50 -compression_level 6 -fs 500k ${output}`;

    exec(cmd, (err) => {
      if (err) return reject(err)
      resolve(output)
    })
  })
}

export function toSticker(input, output, type, meta = null) {
  return new Promise((resolve, reject) => {
    let args

    if (type === 'image') {
      args = [
        '-i', input,
        '-vf', "crop='min(iw,ih)':'min(iw,ih)',scale=512:512,setsar=1",
        '-vcodec', 'libwebp',
        '-lossless', '0',
        '-q:v', '90',
        '-preset', 'drawing',
        '-metadata', 'title=sticker',
        output
      ]
    } else {
      args = [
        '-i', input,
        '-t', '6',
        '-vf', "crop='min(iw,ih)':'min(iw,ih)',scale=512:512:flags=lanczos,fps=10",
        '-c:v', 'libwebp_anim',
        '-pix_fmt', 'yuva420p',
        '-loop', '0',
        '-an',
        '-fps_mode', 'cfr',
        '-q:v', '75',
        '-compression_level', '0',
      ]

      if (meta) {
        const metaJson = JSON.stringify(meta)
        args.push('-metadata', `comment=${metaJson}`)
      }

      args.push(output)
    }

    execFile('ffmpeg', args, (err) => {
      if (err) return reject(err)
      resolve(output)
    })
  })
}