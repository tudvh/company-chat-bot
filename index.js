require('dotenv').config()
const Pusher = require('pusher-js')
const Bot = require('./Bot')

const pusher = new Pusher('effbfb47a66d70473872', {
  cluster: 'ap1',
  encrypted: true,
})

const channelId = 'dcca15f2-8f89-4c15-a272-cdf16ae905bb'
const roomId = 'c719e57b-0501-49c9-aee5-c9359c0530de'

const channel = pusher.subscribe(roomId)

channel.bind('new-message', async data => {
  switch (data.content) {
    case '*meeting help':
      await new Promise(resolve => setTimeout(() => resolve(), 300))
      Bot.sendMessage(roomId, `*meeting now: tạo một phòng họp ngay lập tức`)
      break
    case '*meeting now':
      const rooms = await Bot.getMeetingChannel()
      await new Promise(resolve => setTimeout(() => resolve(), 300))
      const content = `Hãy vào phòng: <a href='/channels/${channelId}/${rooms[0]}'}>Link</a>`
      Bot.sendMessage(roomId, content)
      break
  }
})

pusher.connection.bind('connected', () => {
  console.log('Đã kết nối tới Pusher')
})

pusher.connection.bind('disconnected', () => {
  console.log('Đã ngắt kết nối khỏi Pusher')
})

pusher.connection.bind('error', err => {
  console.error('Lỗi kết nối Pusher:', err)
})

function subscribeToMultipleChannels(channelNames) {
  channelNames.forEach(channelName => {
    const channel = pusher.subscribe(channelName)

    channel.bind('your-event-name', data => {
      console.log(`Sự kiện từ kênh ${channelName}:`, data)
    })
  })
}

function unsubscribeFromChannel(channelName) {
  pusher.unsubscribe(channelName)
  console.log(`Đã hủy đăng ký kênh ${channelName}`)
}

process.on('SIGINT', () => {
  console.log('Đóng kết nối Pusher...')
  pusher.disconnect()
  process.exit()
})
