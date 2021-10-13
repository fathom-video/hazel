// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const Cache = require('./cache')

module.exports = config => {
  const router = Router()
  let cache = null;

  try {
    cache = new Cache(config)
  } catch (err) {
    const { code, message } = err

    if (code) {
      return (req, res) => {
        res.statusCode = 400;

        res.end(JSON.stringify({
          error: {
            code,
            message
          }
        }))
      }
    }

    throw err
  }

  const routes = require('./routes')({ cache, config })

  // Define a route for every relevant path
  router.get('/', routes.overview)
  router.get('/download', routes.download)
  router.get('/download/:platform', routes.downloadPlatform)
  router.get('/download/:platform/:arch', routes.downloadPlatform)
  router.get('/update/:platform/:version', routes.update)
  router.get('/update/:platform/:arch/:version', routes.update)
  router.get('/update/win32/:version/RELEASES', routes.releases)
  router.get('/update/win32/x64/:version/RELEASES', routes.releases)
  router.get('/update/darwin/:arch/:version', routes.updateDarwinWithArch)
  router.get('/download/darwin/:arch/:version', routes.downloadDarwinWithArch)
  router.get('/download/file/:filename', routes.downloadFile)
  return (req, res) => {
    router(req, res, finalhandler(req, res))
  }
}
