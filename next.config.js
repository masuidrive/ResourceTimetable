// next.config.js
const isProduction = (process.env.NODE_ENV == 'production')
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  assetPrefix: isProduction ? `${process.env.DEPLOY_PREFIX}` : '',
  exportPathMap: () => ({
    '/': { page: '/' },
    // '/settings': { page: '/settings' },
  })
})