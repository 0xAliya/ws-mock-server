export default {
  open: [{
    type: 'open',
  }],
  interval: [{
    data: {
      type: 'interval',
      message: 'This is a message',
    },
    interval: 3000,
  }],
  handleMessage(message, send, { addInterval }) {
    switch (message.type) {
      case 'ping':
        send({
          type: 'pong',
        })
        break
      default:
        send({
          message: `I don't understand this message : ${message}`,
        })
        addInterval((time) => {
          return {
            type: 'message',
            message: `It will take some time to process this message : ${message}`,
            progress: (time + 1) * 25,
          }
        }
        , 1000, 4)
        break
    }
  },
}
