const systemInfo = require('../@system/info')

const customInfo = {
  name: 'Broadr',
  url: process.env.APP_URL ?? 'https://broadr.com',
  description: 'The social media API that replaces everything.',
}

module.exports = { ...systemInfo, ...customInfo }
