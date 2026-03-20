
import qrcode from 'qrcode-terminal'
import makeWASocket, {
  useMultiFileAuthState,
  Browsers,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys'

export const startSocket = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    auth: state,
    browser: Browsers.windows('Chrome'),
    version
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, qr }) => {
    if (qr) {
      console.log('📱 Escaneie o QR:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log('✅ Bot conectado')
    }

    if (connection === 'close') {
      console.log('❌ Conexão fechada')
      setTimeout(startSocket, 3000)
    }
  })

  return sock
}