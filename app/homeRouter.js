module.exports = (app)=>{
  // 评论
  app.router.resources('comment','/api/comment', app.controller.home.comment);
  app.router.resources('collection','/api/collection', app.controller.home.collection);
  app.router.resources('library','/api/library', app.controller.home.library);
  app.router.resources('myarticle', '/api/myarticle', app.controller.home.myarticle)
}