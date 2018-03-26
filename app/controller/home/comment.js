const Controller = require('egg').Controller;

class CommentController extends Controller {
    // 获取评论
    async index() {
        let { ctx, service } = this;
        let result = await service.home.comment.index(ctx.query);
        ctx.body = result;
    }
    // 根据传入artical_id查询评论
    async show(){
        let { ctx, service } = this; 
        ctx.body =  await service.home.comment.getCommentByArticle(ctx.params.id);
    }
    // 创建评论
    async create() {
        let { ctx, service } = this;
        ctx.body = await service.home.comment.insertComment(ctx.request.body);
    }
    // 根据传入id删除评论
    async destroy () {
        let { ctx, service } = this;
        ctx.body = await service.home.comment.delComment(ctx.params.id);
    }
}

module.exports = CommentController;