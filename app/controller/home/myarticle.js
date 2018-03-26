const Controller = require('egg').Controller

class MyArticleController extends Controller {
    constructor(ctx) {
        super(ctx)
        this.getRule = {
            user_id: { type: 'number', required: true }
        }
        this.otherRule = Object.assign({
            id: { type: 'number', reuqired: true }
        }, this.createRule)
    }
    async index() {
        const { ctx, service } = this
        ctx.validate(this.getRule, ctx.query)
        ctx.body = await service.home.myarticle.getListCount()
    }
    async update() {
        const { ctx, service } = this
        ctx.validate(this.otherRule)
        ctx.body = await service.home.myarticle.edit()
    }
    async destroy() {
        const { ctx, service } = this
        ctx.validate(this.otherRule)
        ctx.body = await service.home.myarticle.del()
    }
}

module.exports = MyArticleController