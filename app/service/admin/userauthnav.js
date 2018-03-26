const Service = require('egg').Service;

class UserAuthNav extends Service {
    async getAuth(data) {
        const id = data.id;
        let query = `SELECT 
        r.name, r.url, r.icon, r.pid, r.id, rr.role_id, r.type 
        FROM fs_account AS a JOIN fs_role__resources AS rr 
        ON a.role_id = rr.role_id JOIN fs_resources AS r
        ON r.id = rr.resource_id WHERE a.id = ${id}`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
    updateAuth (data) {

    }
}

module.exports = UserAuthNav;