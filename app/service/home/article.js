const Service = require('egg').Service;

class Article extends Service {
    /**
     * 获取热门文章-分页
     * @param {number} offset 当前页 
     * @param {number} limit 条数
     * @param {number} classify 文章分类
     */
    async hotList(offset, limit, classify) {
        return await this.app.mysql.query('SELECT * FROM `fs_article` WHERE classify_id = ? ORDER BY views DESC LIMIT ?,?', [classify, offset, limit])
    }
    /**
     * 获取文章所有分类
     */
    async getClassify() {
        return await this.app.mysql.select('fs_classify', {
            orders: [['id', 'desc']]
        })
    }
    /**
     * 根据文章ID获取文章详情
     * @param {number} id 文章ID
     */
    async getDetail(id) {
        return await this.app.mysql.get('fs_article', { article_id: id })

    }
    async getListCount() {
        const { list, count } = await Promise.all([
            this.app.mysql.query('SELECT * FROM `fs_article`', {
                orders: [['id', 'desc']],
                where: {
                    
                }
            })
        ])
    }
    /**
     * 发布文章
     * @param {object} data 请求对象
     */
    async pubArticle(data) {
        const { ctx } = this
        let result = await this.app.mysql.insert('fs_article', data)
    }
}

module.exports = Article