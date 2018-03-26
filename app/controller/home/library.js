const Controller = require('egg').Controller;

class Library extends Controller {
    async index () {
        const { ctx, service } = this;
        ctx.body = await service.home.library.getLibrary();
    }
    async update () {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const params = ctx.params;
        if (params) {
            body.id = params.id;
        }
        const result = await service.home.library.updateLibrary(body);
        if (result.affectedRows) {
            ctx.body = {
                status: true,
                message: ''
            }
        } else {
            ctx.body = {
                status: false,
                message: '图书馆更新图书失败'
            }
        }
    }
    async create () {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const result = await service.home.library.createLibrary(body);
        if (result.affectedRows) {
            ctx.body = {
                status: true,
                data: []
            }
        } else {
            ctx.body = {
                status: false,
                message: '图书馆新增图书失败'
            }
        }
    }
    async show () {
        const { ctx, service } = this;
        const result = await service.home.library.showLibrary(body);
        if (result.length) {
            ctx.body = {
                data: result,
                status: true,
            }
        } else {
            ctx.body = {
                data: result,
                status: false,
                message: '未找到图书'
            }
        }
    }
    async destroy () {
        const { ctx, service } = this;
        const body = ctx.params;
        // body.id = body.id * 1;
        const result = await service.home.library.deleteLibrary(body);
        if (result.affectedRows) {
            ctx.body = {
                status: true,
                data: []
            }
        } else {
            ctx.body = {
                status: false,
                message: '删除图书失败',
            }
        }
    }
}
module.exports = Library