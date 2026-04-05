import fs from 'fs'

export function addStickerMeta(filePath, { pack, author }) {
    const webp = fs.readFileSync(filePath)

    const data = JSON.stringify({
        'sticker-pack-name': pack,
        'sticker-pack-publisher': author
    })

    const dataBuffer = Buffer.from(data, 'utf-8')

    const exif = Buffer.concat([
        Buffer.from([
            0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00,
            0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
        ]),
        dataBuffer
    ])
    exif.writeUIntLE(dataBuffer.length, 14, 4)

    const paddedExif = exif.length % 2 !== 0
        ? Buffer.concat([exif, Buffer.alloc(1)])
        : exif

    const exifChunkData = Buffer.concat([Buffer.from('EXIF'), Buffer.alloc(4), paddedExif])
    exifChunkData.writeUInt32LE(exif.length, 4)

    const isAnimated = webp.slice(12, 16).toString('ascii') === 'VP8X'

    if (isAnimated) {
        const newWebp = Buffer.concat([webp, exifChunkData])
        newWebp.writeUInt32LE(newWebp.length - 8, 4)
        const flags = newWebp.readUInt32LE(20)
        newWebp.writeUInt32LE(flags | 0x08, 20)
        fs.writeFileSync(filePath, newWebp)
    } else {
        const vp8Chunk = webp.slice(12)

        const width = webp.readUInt16LE(26) & 0x3fff
        const height = webp.readUInt16LE(28) & 0x3fff

        const vp8xData = Buffer.alloc(10)
        vp8xData.writeUInt32LE(0x08, 0)
        vp8xData.writeUIntLE(width - 1, 4, 3)
        vp8xData.writeUIntLE(height - 1, 7, 3)

        const vp8xChunk = Buffer.concat([Buffer.from('VP8X'), Buffer.alloc(4), vp8xData])
        vp8xChunk.writeUInt32LE(10, 4)

        const riffHeader = webp.slice(0, 12)
        const newWebp = Buffer.concat([riffHeader, vp8xChunk, vp8Chunk, exifChunkData])
        newWebp.writeUInt32LE(newWebp.length - 8, 4)

        fs.writeFileSync(filePath, newWebp)
    }
}