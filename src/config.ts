import type { WebSocket } from 'ws'
import type { MockConfig } from './types'

export function handleConfig(ws: WebSocket, config: MockConfig) {
  const intervals: ReturnType<typeof setInterval> [] = []
  const addInterval = (
    message: (time?: number) => void | any,
    intervalTime: number,
    time = 100000,
  ) => {
    let currentTime = 0
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (currentTime < time) {
        send(
          typeof message === 'function' ? message(currentTime) : message,
        )
        currentTime++
      }
      else {
        clearInterval(interval)
      }
    }, intervalTime)
  }

  config.open?.forEach((item) => {
    send(item)
  })

  config.interval?.forEach((item) => {
    intervals.push(setInterval(() => send(typeof item.data === 'function' ? item.data() : item.data), item.interval))
  })

  function send(data) {
    if (typeof data === 'object')
      ws.send(JSON.stringify(data))
    else ws.send(data)
  }

  ws.on('message', (data) => {
    let message = data.toString()
    try {
      message = JSON.parse(message)
    }
    catch (err) {}

    config?.handleMessage(message, send, { addInterval })
  })

  ws.on('close', () => {
    intervals.forEach(interval => clearInterval(interval))
  })
}

