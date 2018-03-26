const Service = require('egg').Service

class MyArticle extends Service {
    async getListCount() {
        const { ctx, app } = this
        const { query, values } = ctx.helper.coverRequest(ctx.query)
        let sql = 'SELECT * FROM `fs_article`' + query
        let countSql = 'SELECT COUNT(*) total FROM `fs_article`' + query
        const [list, total] = await Promise.all([
            app.mysql.query(sql, values),
            app.mysql.query(countSql, values)
        ])
        list.map(item => {
            item.create_time = ctx.helper.formatDate(ctx.helper, item.create_time)
            item.update_time = ctx.helper.formatDate(ctx.helper, item.update_time)
        })
        return {
            status: true,
            data: list,
            total: total[0].total
        }
    }
    async del() {
        const { ctx, app, service } = this
        const query = await app.mysql.get('fs_article', ctx.query)
        if (query) {
            const result = await app.mysql.delete('fs_article', ctx.query)
            const code = (result.affectedRows === 1)
            code && ctx.helper.insertLog(service, ctx, 2, '删除个人文章')
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
        // 事务 删除个人文章同时删除收藏关系表数据
        // const conn = await app.mysql.beginTransaction()
        // try {
        //     await conn.delete('fs_article__account', {
        //         id: ctx.query.id,
        //         user_id: ctx.query.user_id
        //     })
        //     await conn.delete('fs_article', {
        //         id: ctx.query.id,
        //         user_id: ctx.query.user_id
        //     })
        //     await conn.commit()
        //     ctx.helper.insertLog(service, ctx, 2, '删除个人文章')
        // } catch (err) {
        //     await conn.rollback()
        //     throw err
        // }
    }
    async edit() {
        const { ctx, app, service } = this
        const { body } = ctx.request
        const result = await app.mysql.get('fs_article', {
            user_id: body.id,
            id: body.id
        })
        if (result) {
            const edit = await app.mysql.update('fs_article', body)
            const code = (edit.affectedRows === 1)
            code && ctx.helper.insertLog(service, ctx, 2, '修改文章')
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

module.exports = MyArticle