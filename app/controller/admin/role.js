const Controller = require('egg').Controller
class roleController extends Controller {
    // 查询列表和分页
    async index() {
        const { ctx, service } = this;
        ctx.body = await service.common.main.getRoleList();
    }
    // 创建post
    async create() {}
    // 更新 put
    async update() {}
    // 详情 get
    async show() {}
    // 删除 delete
    async destroy() {}
}
module.exports = roleController