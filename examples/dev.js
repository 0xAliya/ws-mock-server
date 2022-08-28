import { createServer } from 'vite'
import { initMockSocket } from 'ws-mock-server'

async function start() {
  const server = await createServer()
  await server.listen(8080)

  initMockSocket(server.httpServer, {
    context: ['/test'],
    fileRoot: './mock',
  })

  server.printUrls()
}

start()
