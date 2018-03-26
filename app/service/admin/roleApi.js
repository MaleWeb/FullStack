const Service = require('egg').Service;

class RoleApi extends Service {
    async getApis (data) {
        const id = data.role_id;
        let query = `SELECT * FROM fs_role__apis as rr JOIN fs_apis as r on rr.api_id = r.id WHERE rr.role_id = ${id}`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
}

module.exports = RoleApi;