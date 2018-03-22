const Controller = require('egg').Controller;
/**
 * index,create,show,update,destory
 * 获取所有列表和分页 index get
 * 创建 create post
 * 获取某一个 show get
 * 更新 update put
 * 删除 destroy delete
 */
class CommonController extends Controller {
    // 获取所有用户列表
    async index() {
        const { ctx, service } = this
        ctx.body = await service.common.main.getUser(ctx.query);
    }
    // 删除用户
    async destroy() {
        const { ctx, service } = this
        const { id } = ctx.params
        ctx.body = await service.common.main.delUser(id)
        ctx.status = 204
    }
    // 更新用户信息
    async update() {
        const { ctx, service } = this
        const { id } = ctx.params
        const result = await service.common.main.editUser(id, ctx.request.body)
        ctx.status = result ? 201 : 500
        if (result) {
            ctx.status = 201
        } else {
            ctx.throw(500)
        }
    }
    // 获取单个用户详情
    async show() {
        const { ctx, service } = this
        const { id } = ctx.params
        ctx.body = await service.common.main.getUserDetail(id)
    }
    // 登录
    async sigin() {
        let { ctx, service } = this;
        // 1、修改为 egg valide验证  ctx.validate(createRule);
        if (ctx.request.body.user_name == '' || ctx.request.body.user_password == '') {
            ctx.body = {
                status: false,
                message: '登录失败'
            }
        } else {
            let data = await service.common.main.sigin(ctx.request.body);           
            ctx.body = data;
            if(data.status){
                ctx.helper.insertLog(service,ctx,1,'登录');
            }
            
        }
    }
    // 注册
    async signUp() {
        const { ctx, service } = this;
        if (ctx.request.body.user_name == '' || ctx.request.body.user_password == '') {
            ctx.body = {
                status: false,
                message: '注册失败'
            }
        } else {
            let data = await service.common.main.signUp(ctx.request.body);
            ctx.body = data;
            if(data.status){
                ctx.helper.insertLog(service,ctx,1,'注册');
            }
        }
    }

    async exit(){
        const { ctx, service } = this;
        ctx.helper.insertLog(service,ctx,1,'退出登录');
        let data = await service.common.main.exit(ctx.request.body);
        ctx.body = data;
    }

}

module.exports = CommonController;