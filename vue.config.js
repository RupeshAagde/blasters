module.exports = {
    pwa: {  
      // configure the workbox plugin
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
      }
    }
  }