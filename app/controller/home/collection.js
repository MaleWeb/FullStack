const Controller = require('egg').Controller;

class Collection extends Controller {
    // 获取收藏
    async index () {
        const { ctx, service } = this;
        let body = ctx.query;
        body.user_id = ctx.session.user.id;
        const result = await service.home.collection.getCollection(body);
        ctx.body = result;
    }
    // 新增收藏
    async create () {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const session = ctx.session;
        const data = {
            article_id: body.article_id,
            article_name: body.article_title,
            user_id: session.user.id,
            auth_id: body.pub_user_id,
            article_desc: body.article_desc,
            create_time: body.create_time,
        };
        if (await service.home.collection.checkCollection(data)) {
            ctx.body = {
                data: [],
                status: false,
                message: '文章已经收藏'
            }
            return;
        }
        const result = await service.home.collection.insertCollection(data); 
        if (result.affectedRows === 1) {
            ctx.body = {
                data: result,
                status: true
            }
        } else {
            ctx.body = {
                data: [],
                status: false,
                message: '添加收藏失败'
            }
        }
    }
    // 删除收藏
    async destroy () {
         const { ctx, service } = this;
         const params = ctx.params;
         const user = ctx.session.user;
         const data = {
             article_id: params.id,
             user_id: user.id
         }
         const result = await service.home.collection.deleteCollection(data);
         if (result.affectedRows === 1) {
             ctx.body = {
                 data: result,
                 status: true
             }
         } else {
             ctx.body = {
                 data: result,
                 status: false,
                 message: '删除收藏失败'
             }
         }
    }
}
module.exports = Collection;