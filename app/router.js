module.exports = app => {
  // 公用
  app.router.redirect('/', '/admin', 302);
  app.get('/home(/.+)?', app.controller.home.main.hot)
  app.get('/admin(/.+)?', app.controller.admin.main.index)
  app.post('/api/user/exit', app.controller.common.user.exit)
  app.post('/api/sigin', app.middleware.md5(), app.controller.common.user.sigin)
  app.post('/api/signUp', app.middleware.md5(), app.controller.common.user.signUp)

  app.router.resources('user','/api/user', app.controller.common.user)
  app.router.resources('role','/api/role', app.controller.admin.role)

  
  //后台接口
  require('./adminRouter')(app);

  // 社区接口
  require('./homeRouter')(app);
};