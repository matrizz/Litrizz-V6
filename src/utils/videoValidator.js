export function isValidVideo(msg) {
    return !!(
        msg?.videoMessage ||
        msg?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
    )
}