// next.config.js
const isProduction = (process.env.NODE_ENV == 'production')

module.exports = {
  assetPrefix: isProduction ? `${process.env.DEPLOY_PREFIX}` : '',
  exportPathMap: () => ({
    '/': { page: '/' }
  })
}