const Service = require('egg').Service;
class Collection extends Service {
    async getCollection (data) {
        const { ctx } = this;
        const { query, values } = ctx.helper.coverRequest(data);
        const sql = `SELECT * FROM fs_user__collection ${query}`;
        const sqlCount = `SELECT COUNT(*) total FROM fs_user__collection ${query}`;
        const [total, result] = await Promise.all([
            this.app.mysql.query(sqlCount, values),
            this.app.mysql.query(sql, values)
        ])
        return {
            data: result,
            total: total[0].total,
            status: true
        }
    }
    async insertCollection (data) {
        const { ctx, service } = this;
        const result = await this.app.mysql.insert('fs_user__collection', data);
        ctx.helper.insertLog(service,ctx,2,'添加收藏');
        return result;
    }
    async deleteCollection (data) {
        const { ctx, service } = this;
        const result = await this.app.mysql.delete('fs_user__collection', data);
        ctx.helper.insertLog(service, ctx, 2, '删除收藏');
        return result;
    }
    async checkCollection (data) {
        const result = await this.app.mysql.get('fs_user__collection', { user_id: data.user_id, article_id: data.article_id });
        return result;
    }
}
module.exports = Collection;