const Controller = require('egg').Controller;

class LibraryItem extends Controller {
    async index () {
        const { ctx, service } = this;

    }
    async show () {
        const { ctx, service } = this;
        const body = ctx.query;
        
    }
}

module.exports = LibraryItem;