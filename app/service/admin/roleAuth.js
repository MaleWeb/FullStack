const Service = require('egg').Service;

class RoleNav extends Service {
    async getAuth(data) {
        const id = data.role_id;
        let query = `SELECT * FROM fs_role__resources as rr JOIN fs_resources as r on rr.resource_id = r.id WHERE rr.role_id = ${id}`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
    updateAuth (data) {

    }
}

module.exports = RoleNav;