const Service = require('egg').Service;

class Common extends Service {
    // 获取用户列表
    async getUser(data) {
        console.log(data);
        let uid = data.id ? data.id : '';
        let username = data.user_name ? data.user_name : '';
        let roleid = data.role_id ? data.role_id : '';
        let offset = (parseInt(data.pageIndex) - 1) * parseInt(data.pageSize);
        let limit = parseInt(data.pageSize);

        let total = await this.app.mysql.query('SELECT COUNT(*) total FROM fs_account');
        return {
            data: await this.app.mysql.query(
                `SELECT 
                u.id,u.user_name,u.create_time,u.role_id,r.role_name,u.user_age,u.user_photo,u.user_email
                FROM fs_account u INNER JOIN fs_role r ON u.role_id = r.id 
                WHERE u.id LIKE '%`+ uid + `%' 
                AND u.user_name LIKE '%`+ username + `%'
                AND u.role_id LIKE '%`+ roleid + `%'
                ORDER BY u.id DESC LIMIT ?,?;`,
                [offset, limit]),
            total: total[0].total,
            status: true
        }
    }

    async getRoleList() {
        return await this.app.mysql.query('SELECT * FROM fs_role');
    }
    async sigin(data) {
        const ctx = this.ctx;
        const flag = await this.app.mysql.get('fs_account', { user_name: data.user_name });
        if (flag === null) {
            return {
                status: false,
                message: '账户不存在'
            }
        } else {
            if (flag.user_password === data.user_password) {
                delete flag.user_password;
                ctx.session.user = flag;
                return {
                    data: flag,
                    status: true,
                    message: '登录成功'
                }
            } else {
                return {
                    status: false,
                    message: '密码错误'
                }
            }
        }

        return flag;
    }
    async signUp(data) {
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
            if (result.affectedRows === 1) {
                return {
                    status: true,
                    message: '注册成功'
                }
            } else {
                return {
                    status: true,
                    message: '注册失败'
                }
            }
        }
    }
    /**
     * 删除用户
     * @param {number} id 用户id
     */
    async delUser(id) {
        const { app } = this
        return await app.mysql.delete('fs_account', {
            id: id
        })
    }
    /**
     * 更新用户
     * @param {number} id 用户id
     * @param {object} datas 修改的数据 
     */
    async editUser(id, datas) {
        const { app } = this
        const result = await app.mysql.get('fs_account', { id: id })
        if (result === null) {
            ctx.throw(404)
        } else {
            const result1 = await app.mysql.update('fs_account', datas);
            return (result1.affectedRows === 1)
        }
    }
    /**
     * 用户详情
     * @param {number} id 用户id
     */
    async getUserDetail(id) {
        const { ctx, app } = this
        let result = await app.mysql.get('fs_account', { id: id })
        if (result === null) {
            ctx.throw(404)
        }
        result.create_time = ctx.helper.formatDate(ctx.helper, result.create_time)
        result.update_time = ctx.helper.formatDate(ctx.helper, result.update_time)
        delete result.user_password
        return result
    }
    async getAuth(data) {
        const id = data.role_id;
        let query = `SELECT 
        s.name, s.url, s.icon, s.pid, s.id, r.role_id 
        FROM fs_resources AS s JOIN fs_role__resources AS r ON r.role_id = ${id} 
        where s.id = r.resource_id`;
        return await this.app.mysql.query(query);
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