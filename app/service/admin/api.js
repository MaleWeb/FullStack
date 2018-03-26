const Service = require('egg').Service;

class Api extends Service {
    async getApis () {
        let query = `SELECT * from fs_apis`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
}

module.exports = Api;