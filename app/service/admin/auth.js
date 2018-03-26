const Service = require('egg').Service;

class Auth extends Service {
    async getAuth() {
        let query = `SELECT * from fs_resources`;
        const result = await this.app.mysql.query(query);
        return result || [];
    }
    updateAuth (data) {

    }
}

module.exports = Auth;