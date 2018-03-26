const Service = require('egg').Service;

class Article extends Service {
  /**
   * 获取热门文章-分页
   * @param {number} offset 当前页 
   * @param {number} limit 条数
   * @param {number} classify 文章分类
   */
  async hotList(pageIndex, pageSize, classify) {
    let offset = (pageIndex - 1) * pageSize
    let limit = parseInt(pageSize)
    const result = await this.app.mysql.query('SELECT * FROM `fs_article` WHERE classify_id = ? ORDER BY views DESC LIMIT ?,?', [classify, offset, limit])
    return {
      status: true,
      data: result
    }
  }
  /**
   * 根据文章ID获取文章详情
   */
  async getDetail() {
    const { ctx, app } = this
    const { id } = ctx.query
    const result = await app.mysql.get('fs_article', { id: id })
    return {
      status: true,
      data: result
    }
  }
  /**
   * 获取文章列表-分页-模糊查询
   */
  async getListCount() {
    const { ctx, app } = this
    let { query, values, count } = ctx.helper.coverRequest(ctx.query, 'e')
    let countSql = 'SELECT COUNT(*) total FROM `fs_article` AS e' + count
    let sql = 'SELECT e.*,t.user_name FROM `fs_article` AS e JOIN `fs_account` AS t ON e.user_id = t.id' + query
    const [list, total] = await Promise.all([
      app.mysql.query(sql, values),
      app.mysql.query(countSql, values)
    ])
    list.map(item => {
      item.create_time = ctx.helper.formatDate(ctx.helper, item.create_time)
      item.update_time = ctx.helper.formatDate(ctx.helper, item.update_time)
    })
    return {
      data: list,
      total: total[0].total,
      status: true
    }
  }
  /**
   * 发布文章
   */
  async pubArticle() {
    const { ctx, service, app } = this
    const now = app.mysql.literals.now
    ctx.request.body.create_time = ctx.request.body.update_time = now
    const result = await app.mysql.insert('fs_article', ctx.request.body)
    const code = (result.affectedRows === 1)
    code && ctx.helper.insertLog(service, ctx, 2, '发布文章')
    return {
      status: code,
      message: code ? "发布文章成功" : "发布文章失败"
    }
  }
  /**
   * 删除文章
   */
  async del() {
    const { ctx, service, app } = this
    const { id } = ctx.params
    const query = await app.mysql.get('fs_article', { id: id })
    if (query) {
      const result = await app.mysql.delete('fs_article', { id: id })
      const code = (result.affectedRows === 1)
      code && ctx.helper.insertLog(service, ctx, 2, '删除文章')
      return {
        status: code,
        message: code ? "删除文章成功" : "删除文章失败"
      }
    } else {
      return {
        status: false,
        message: "文章不存在"
      }
    }
  }
  async editArticle() {
    const { ctx, service, app } = this
    const { id } = ctx.query
    const data = ctx.request.body
    const query = await app.mysql.get('fs_article', { id: id })
    if (query) {
      const result = await app.mysql.update('fs_article', data)
      const code = (result.affectedRows === 1)
      code && ctx.helper.insertLog(service, ctx, 2, '修改文章');
      return {
        status: code,
        message: code ? "修改文章成功" : "修改文章失败"
      }
    } else {
      return {
        status: false,
        message: "文章不存在"
      }
    }
  }
}

module.exports = Article