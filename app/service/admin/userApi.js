const Service = require('egg').Service;

class UserApi extends Service {
    async getApis (data) {
        const id = data.id;
        let query = `SELECT 
        r.name, r.address, r.id, rr.role_id, r.method
        FROM fs_account AS a JOIN fs_role__apis AS rr 
        ON a.role_id = rr.role_id JOIN fs_apis AS r
        ON r.id = rr.api_id WHERE a.id = ${id}`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
}

module.exports = UserApi;