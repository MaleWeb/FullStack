const Service = require('egg').Service;

class Common extends Service {
    // 获取用户列表
    async getUser() {
        const { ctx, app } = this
        const data = ctx.query
        let { query, values, count } = ctx.helper.coverRequest(data, 'u')
        let countSql = 'SELECT COUNT(*) total FROM fs_account AS u' + count
        let sql = 'SELECT u.*,r.role_name,l.level_name,e.line_name ' +
        'FROM fs_account u JOIN fs_role r ON u.role_id = r.id ' + 
        'JOIN fs_skill AS l ON u.skill_id=l.id ' + 
        'JOIN fs_online AS e ON u.online_id=e.id' + query
        let [list, total] = await Promise.all([
            app.mysql.query(sql, values),
            app.mysql.query(countSql, values)
        ])
        list.map(item => {
            item.create_time = ctx.helper.formatDate(ctx.helper, item.create_time)
            item.update_time = ctx.helper.formatDate(ctx.helper, item.update_time)
            delete item.user_password
        })
        return {
            data: list,
            total: total[0].total,
            status: true
        }
    }
    // 登录
    async sigin(data) {
        const { ctx, service } = this;
        const flag = await this.app.mysql.get('fs_account', { user_name: data.user_name });
        if (flag === null) {
            return {
                status: false,
                message: '账户不存在'
            }
        } else {
            if (flag.user_password === data.user_password) {
                delete flag.user_password;
                const currDate = new Date()
                flag.loginTime = currDate.toLocaleString();
                ctx.session.user = flag;
                ctx.helper.insertLog(service, ctx, 1, '登录');
                return {
                    data: flag,
                    status: true,
                    message: '登录成功'
                }
            } else {
                return {
                    status: false,
                    message: '账号或密码错误'
                }
            }
        }

        return flag;
    }
    // 注册
    async signUp(data) {
        const { ctx, service } = this;
        const flag = await this.app.mysql.get('fs_account', { user_name: data.user_name });
        if (flag !== null) {
            return {
                status: false,
                message: '用户名已存在'
            }
        } else {
            const currDate = new Date();
            data.create_time = currDate.toLocaleString();
            data.update_time = currDate.toLocaleString();
            data.user_score = 0;
            const result = await this.app.mysql.insert('fs_account', data);
            const code = (result.affectedRows === 1)
            code && ctx.helper.insertLog(service, ctx, 1, '注册')
            return {
                status: code,
                message: code ? '注册成功' : '注册失败'
            }
        }
    }
    /**
     * 删除用户
     */
    async delUser() {
        const { ctx, app, service } = this
        const { id } = ctx.params
        const query = await app.mysql.get('fs_account', { id: id })
        if (query) {
            const result = await app.mysql.delete('fs_account', {
                id: id
            })
            const code = (result.affectedRows === 1)
            code && ctx.helper.insertLog(service, ctx, 2, '删除用户')
            return {
                status: code,
                message: code ? "删除用户成功" : "删除用户失败"
            }
        } else {
            return {
                status: false,
                message: "用户不存在"
            }
        }
    }
    /**
     * 更新用户
     */
    async editUser() {
        const { app, ctx, service } = this
        const { id } = ctx.params
        const datas = ctx.request.body
        const query = await app.mysql.get('fs_account', { id: id })
        if (query) {
            const result = await app.mysql.update('fs_account', datas);
            const code = (result.affectedRows === 1)
            code && ctx.helper.insertLog(service, ctx, 2, '修改用户')
            return {
                status: code,
                message: code ? "修改用户成功" : "修改用户失败"
            }
        } else {
            return {
                status: false,
                message: "用户不存在"
            }
        }
    }
    /**
     * 用户详情
     */
    async getUserDetail() {
        const { ctx, app } = this
        const { id } = ctx.params
        let result = await app.mysql.get('fs_account', { id: id })
        if (!result) {
            return {
                status: false,
                message: "用户不存在"
            }
        }
        result.create_time = ctx.helper.formatDate(ctx.helper, result.create_time)
        result.update_time = ctx.helper.formatDate(ctx.helper, result.update_time)
        delete result.user_password
        return {
            status: true,
            data: result
        }
    }
    async getAuth(data) {
        const id = data.id;
        let query = `SELECT 
        r.name, r.url, r.icon, r.pid, r.id, rr.role_id 
        FROM fs_account AS a JOIN fs_role__resources AS rr 
        ON a.role_id = rr.role_id JOIN fs_resources AS r
        ON r.id = rr.resource_id WHERE a.id = ${id}`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
    async getApis(data) {
        const id = data.id;
        let query = `SELECT 
        r.name, r.address, r.id, rr.role_id, r.method
        FROM fs_account AS a JOIN fs_role__apis AS rr 
        ON a.role_id = rr.role_id JOIN fs_apis AS r
        ON r.id = rr.api_id WHERE a.id = ${id}`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
    async checkApi(ctx) {
        const { app, service } = this;
        const result = await service.common.main.getApis(ctx.session.user);
        return result;
    }
    async exit(data) {
        const { ctx, app } = this
        ctx.session.user = null;
        return {
            status: true,
            message: '退出登录成功'
        }
    }
}

module.exports = Common