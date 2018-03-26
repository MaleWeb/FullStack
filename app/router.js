module.exports = app => {
  // 公用
  app.router.redirect('/', '/admin', 302);
  app.get('/home(/.+)?', app.controller.home.main.index)
  app.get('/admin(/.+)?', app.controller.admin.main.index)
  app.post('/api/user/exit', app.controller.common.user.exit)
  app.post('/api/sigin', app.middleware.md5(), app.controller.common.user.sigin)

  app.router.resources('user','/api/user', app.middleware.md5(), app.controller.common.user)
  app.router.resources('role','/api/role', app.controller.admin.role)
  app.router.resources('api','/api/api', app.controller.admin.api)
  app.router.resources('tag','/api/tag', app.controller.common.tag)

  app.router.resources('article', '/api/article', app.controller.common.article)
  app.router.resources('classify', '/api/classify', app.controller.common.classify)
  
   //支持 form表单上传（element组件上传）
  // post传递地址 "'/api/upload?_csrf='+token"
  // 默认存储地址为 asset/images
  app.post('/api/upload', app.controller.common.upload.index)
  //后台接口
  require('./adminRouter')(app);

  // 社区接口
  require('./homeRouter')(app);
};