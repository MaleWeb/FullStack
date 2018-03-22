const Controller = require('egg').Controller;

class LogController extends Controller {
  async index() {
    const { ctx } = this
    let data =  await ctx.service.admin.log.getLogList(ctx.query);
    ctx.body = data;
  }
}

module.exports = LogController;