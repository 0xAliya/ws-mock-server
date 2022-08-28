import type { IncomingMessage } from 'http'

export interface MockConfig {
  open: Array<any>
  interval: Array<{
    data: () => any | any
    interval: number
  }>

  handleMessage(
    message: any,
    send: (data: any) => void,
    utils?: {
      addInterval: (
        message: (time?: number) => void | any | any[],
        interval: number,
        time: number
      ) => void
    }
  ): void
}

export interface MockSocketOptions {
  fileRoot: string
  context:
  | string
  | string[]
  | ((pathName: string, req: IncomingMessage) => boolean)
}

