const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.renderClient('home/index.js');
  }
}

module.exports = HomeController;