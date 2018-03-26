const Controller = require('egg').Controller;
/**
 * index,create,show,destroy
 * 获取所有的标签   index   get
 * 创建新标签  create post
 * 获取某一个标签   show get
 * 删除某个标签 destroy delete
 * 修改某个标签  update put
 */

 class TagConyroller extends Controller {
    //获取所有的标签
    async index() {
        const { ctx, service } = this;
        ctx.body = await service.common.tag.getTag();
     }
    //删除某个标签
    async destroy() {
        const { ctx, service } = this;
        const { id } = ctx.params;
        ctx.body = await service.common.tag.delTag(id);
    }
    //添加标签
    async create() {
        const { ctx, service } = this;
        ctx.body = await service.common.tag.addTag(ctx.request.body);
    }
 }

 module.exports = TagConyroller;