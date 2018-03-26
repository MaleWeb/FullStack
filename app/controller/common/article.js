const Controller = require('egg').Controller

class ArticleController extends Controller {
    constructor(ctx) {
        super(ctx)
        this.createRule = {
            article_title: { type: 'string', required: true },
            user_id: { type: 'number', required: true },
            classify_id: { type: 'number', required: true },
            type_id: { type: 'number', required: true }
        }
        this.otherRule = {
            id: { type: 'number', required: true }
        }
    }
    async index() {
        const { ctx, service } = this
        ctx.body = await service.common.article.getListCount()
    }
    async create() {
        const { ctx, service } = this
        ctx.validate(this.createRule)
        ctx.body = await service.common.article.pubArticle()
    }
    async update() {
        const { ctx, service } = this
        ctx.validate(this.otherRule)
        ctx.body = await service.common.article.editArticle()
    }
    async show() {
        const { ctx, service } = this
        ctx.validate(this.otherRule)
        ctx.body = await service.common.article.getDetail()
    }
    async destroy() {
        const { ctx, service } = this
        ctx.validate(this.otherRule)
        ctx.body = await service.common.article.del()
    }
}

module.exports = ArticleController