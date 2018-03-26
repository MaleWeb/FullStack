const Service = require('egg').Service;

class Role extends Service {
    async getRoleList () {
        return await this.app.mysql.query(`SELECT * FROM fs_role`);
    }
}

module.exports = Role;