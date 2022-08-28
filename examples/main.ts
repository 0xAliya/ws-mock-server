function main() {
  const socket = new WebSocket('ws://localhost:8080/test')

  const logContainer = document.querySelector<HTMLTextAreaElement>('#log')!
  const messageTextarea = document.querySelector<HTMLTextAreaElement>('#message')!

  socket.onmessage = (event: MessageEvent) => {
    const p = document.createElement('p')
    p.innerText = event.data
    logContainer.appendChild(p)
  }

  document.querySelector<HTMLButtonElement>('#send')!.onclick = () => {
    socket.send(messageTextarea.value)
    messageTextarea.value = ''
  }

  document.querySelector<HTMLButtonElement>('#close')!.onclick = () => {
    socket.close()
  }
}

main()
