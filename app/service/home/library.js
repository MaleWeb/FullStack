const Service = require('egg').Service;

class Library extends Service {
    async getLibrary () {
        const { ctx, service, app } = this;
        const body = ctx.query;
        const { query, values, count } = ctx.helper.coverRequest(body);
        const sql = `SELECT * FROM fs_library ${query}`;
        const countSql = `SELECT COUNT(*) total FROM fs_library ${count}`;
        const [list, total] = await Promise.all([
            app.mysql.query(sql, values),
            app.mysql.query(countSql, values)
        ]);
        return {
            data: list,
            total: total[0].total,
            status: true
        }
    }
    async updateLibrary (body) {
        const { ctx, app, service } = this;
        const result = await app.mysql.update('fs_library', body);
        ctx.helper.insertLog(service, ctx, 2, '更新图书');
        return result;
    }
    async createLibrary () {
        const { ctx, app, service } = this;
        const body = ctx.request.body;
        delete body.id;
        const result = await app.mysql.insert('fs_library', body);
        ctx.helper.insertLog(service, ctx, 2, '新增图书');
        return result;
    }
    async deleteLibrary (data) {
        const { ctx, app, service } = this;
        const result = await app.mysql.delete('fs_library', data);
        ctx.helper.insertLog(service, ctx, 2, '删除图书');
        return result;
    }
    async showLibrary (data) {
        const { ctx, app, service } = this;
        const result = await app.mysql.get('fs_library', {data});
        return result;
    }
    // 图书详情
    async libraryDetail (data) {
        const { ctx, app, service } = this;
        const result = await app.mysql.get('fs_library_item', data);
        return result;
    }
    // 图书是否购买
    async librarayIsbuy (body) {
        const { ctx, app, service } = this;
        const result = await app.mysql.get('fs_user__library', {user_id: body.user_id, lib_id: id});
        return result;
    }
    // 图书是否免费
    async libraryIsfree () {
        const {ctx, app, service} = this;
    }
    // 删除图书item
    async deleteLibraryItem () {

    }
    async insertLibraryItem (body) {
        const { ctx, app, service } = this;
        const result = await app.mysql.insert('fs_library__item', body);
        return result;
    }
}

module.exports = Library;