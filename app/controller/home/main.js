const Controller = require('egg').Controller;

class AppController extends Controller {
  // 首页热门列表
  async hot() {
    let { ctx, service } = this;
    let data;
    if (ctx.query.pageIndex !== undefined) {
      data = { list: await service.home.article.hotList((ctx.query.pageIndex - 1) * ctx.query.pageSize, parseInt(ctx.query.pageSize), ctx.query.classify) }
      ctx.body = data
      ctx.status = 200
    } else {
      await this.ctx.renderClient('home/index.js');
      ctx.status = 200
    }
  }
  // 获取所有分类
  async classify() {
    const { ctx, service } = this
    ctx.body = await service.home.article.getClassify()
    ctx.status = 200
  }
  // 获取文章详情
  async detail() {
    const { ctx, service } = this
    ctx.body = await service.home.article.getDetail(ctx.query.id)
    ctx.status = 200
  }
}

module.exports = AppController;