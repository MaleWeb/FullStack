const Controller = require('egg').Controller;

/**
 * index,create,show,update,destory
 * 获取所有列表和分页 index get
 * 创建 create post
 * 获取某一个 show get
 * 更新 update put
 * 删除 destory delete
 */
class UserAuthNavController extends Controller {
  async index () {
    const { ctx, service } = this;
    const auth = await service.admin.roleAuth.getAuth(ctx.query);
    const allAuth = await service.admin.auth.getAuth();
    allAuth.map(item => {
        item.isSelect = false;
        for (let i = 0; i < auth.length; i ++) {
            if (item.id === auth[i].id) {
                item.isSelect = true;
                auth.splice(i, 1);
                break;
            }
        }
    })
    if (auth) {
      ctx.body = {
        data: ctx.helper.toTree(allAuth),
        status: true
      }
    } else {
      ctx.body = {
        data: [],
        status: false,
        message: '未找到用户对应的资源'
      }
    }
  }
  async update () {
    const { ctx, service } = this;
    // console.log(ctx.session);
    const apis = await service.common.user.checkApi(ctx)
    const auth = await service.common.user.getAuth(ctx.session.user);
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
  async destroy () {
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

module.exports = UserAuthNavController;