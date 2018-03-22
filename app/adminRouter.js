module.exports = (app)=>{
    app.router.resources('logs','/api/logs', app.controller.admin.log)
    app.post('/back/delete', app.controller.admin.main.delete);
    app.post('/back/updateRoles', app.controller.admin.main.updateRoles);
    
    app.post('/updateuser', app.controller.admin.main.updateUser);
    app.post('/deleteuser', app.controller.admin.main.deleteUser);
}
