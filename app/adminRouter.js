module.exports = (app)=>{
    app.router.resources('logs','/api/logs', app.controller.admin.log)
    // app.post('/back/delete', app.controller.admin.main.delete);
    // app.post('/back/updateRoles', app.controller.admin.main.updateRoles);
    app.router.resources('nav','/api/auth', app.controller.admin.auth);   // 菜单
    app.router.resources('api','/api/api', app.controller.admin.api);   // 接口
    app.router.resources('usernav','/api/usernav', app.controller.admin.usernav);   // 授权导航
    app.router.resources('userapi','/api/userapi', app.controller.admin.userapi);   // 授权接口
    app.router.resources('userapi','/api/userauthapi', app.controller.admin.userAuthApi);   // 授权接口
    app.router.resources('userapi','/api/userauthnav', app.controller.admin.userAuthNav);   // 授权接口
}
