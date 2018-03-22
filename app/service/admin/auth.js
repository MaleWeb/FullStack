const Service = require('egg').Service;

class Auth extends Service {
    async updateUser (data) {
        const values = [];
        const sql = [];
        Object.keys(data).map(item => {
            if (item === 'id') {
                return;
            }
            sql.push(item + ' = ?');
            values.push(data[item]);
        })
        values.push(data.id);
        const query = `UPDATE fs_account SET ${sql.join(', ')} WHERE id = ?`;
        return await this.app.mysql.query(query, values);
    }
    async deleteUser (id) {
        return await this.app.mysql.delete('fs_account', {id});
    }
}

module.exports = Auth;