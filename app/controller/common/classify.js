const Controller = require('egg').Controller

class ClassifyController extends Controller {
    async index() {
        const { ctx, service } = this
        ctx.body = await service.common.classify.getAll()
    }
}

module.exports = ClassifyController