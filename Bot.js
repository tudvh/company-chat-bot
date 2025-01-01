require('dotenv').config()

const axios = require('axios')

class Bot {
  constructor() {
    this.baseUrl = process.env.APP_API_URL
    this.joinedChannelIds = []

    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer`,
      },
    })
    this.login()
  }

  async login() {
    try {
      const response = await this.api.post('/auth/bot-login', {
        email: process.env.BOT_EMAIL,
      })
      const { accessToken, joinedChannelIds } = response.data
      this.api.defaults.headers.Authorization = `Bearer ${accessToken}`
      this.joinedChannelIds = joinedChannelIds
      console.log('Bot logged in')
    } catch (error) {
      console.error('Error logging in:', error.message)
      throw error
    }
  }

  async sendMessage(roomId, content) {
    try {
      const response = await this.api.post('/messages', {
        roomId,
        content,
      })
      console.log('Send message success: ', content)
      return response.data
    } catch (error) {
      console.error('Error sending message:', error.message)
      throw error
    }
  }

  async getMeetingChannel() {
    try {
      const response = await this.api.get(
        'rooms/get-all-free-room?channelId=dcca15f2-8f89-4c15-a272-cdf16ae905bb',
      )
      const rooms = response.data
      if (!rooms) {
        throw new Error('Meeting room not found')
      }
      return rooms
    } catch (error) {
      console.error('Error getting meeting room:', error.message)
      throw error
    }
  }
}

module.exports = new Bot()
