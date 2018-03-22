const Controller = require('egg').Controller;

class AppController extends Controller {
  async index() {
    // await this.ctx.render('admin/index.js',{
    //   url: this.ctx.url.replace(/\/admin/, '')
    // });
    await this.ctx.renderClient('admin/index.js');
  }
  async delete() {
    const { ctx, service } = this;
    // const auth = await service.common.main.getAuth();
    ctx.body = await service.admin.main.delete();
    if(ctx.body.status){
      ctx.helper.insertLog(service,ctx,2,'删除用户');
    }
  }
  async updateRoles() {
    const { ctx, service } = this;
    ctx.body = await service.admin.main.updateRoles();
    if(ctx.body.status){
      ctx.helper.insertLog(service,ctx,2,'更改用户角色');
    }
  }
  async updateUser () {
    const { ctx, service } = this;
    const body = ctx.request.body;
    if (body.user_name && body.role_id && body.id) {
      const result = await service.admin.auth.updateUser(body);
      ctx.helper.insertLog(service,ctx,2,'修改用户资料');
      if (result.affectedRows === 1) {
        ctx.body = {
          message: '用户信息修改成功！',
          success: true
        }; 
      } else {
        ctx.body = {
          message: '信息修改失败',
          success: false
        }
      }
      
    } else {
      ctx.body = {
        success: false,
        message: '资料填写不完整.'
      }
    }
  }
  async deleteUser () {
    const { ctx, service } = this;
    const body = ctx.request.body;
    if (body.id) {
      const result = await service.admin.auth.deleteUser(body.id);
      ctx.helper.insertLog(service,ctx,2,'删除用户');
      if (result.affectedRows === 1) {
        ctx.body = {
          message: '用户删除成功!',
          success: true
        }
      } else {
        ctx.body = {
          message: '用户删除失败',
          success: false
        }
      }
    } else {
      ctx.body = {
        message: '未找到对应的用户',
        success: false
      }
    }
    
  }
}

module.exports = AppController;