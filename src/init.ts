// eslint-disable-next-line n/no-deprecated-api
import { parse } from 'url'
import * as path from 'path'
import type { Server } from 'http'
import { WebSocketServer } from 'ws'
import { handleConfig } from './config'
import type { MockSocketOptions } from './types'

const getContext = (options: MockSocketOptions) => {
  if (typeof options.context === 'string')
    return (pathname: string) => pathname === options.context

  if (Array.isArray(options.context))
    return (pathname: string) => (options.context as string[]).includes(pathname)

  if (typeof options.context === 'function')
    return options.context

  throw new Error('no context option or the type of context is not correct.')
}

export const initMockSocket = (
  server: Server,
  options: MockSocketOptions,
) => {
  const wsServer = new WebSocketServer({
    noServer: true,
  })

  const context = getContext(options)
  server.on('upgrade', async (req, socket, head) => {
    const { pathname, query } = parse(req.url ?? '')

    if (context(pathname ?? '', req)) {
      const fullPath = `file://${path.join(process.cwd(), options.fileRoot, pathname ?? '')}.js`

      let config = (await import(fullPath)).default
      config = typeof config === 'function' ? config({ query }) : config

      wsServer.handleUpgrade(req, socket, head, (ws) => {
        handleConfig(ws, config)
      })
    }
  })
}

