module.exports = (app)=>{
  // app.post('/sigin', app.controller.sigin.index)
  app.get('/classify', app.controller.home.main.classify)
  app.get('/front/detail',app.controller.home.main.detail)
}