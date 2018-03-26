const Service = require('egg').Service

class Classify extends Service {
    async getAll() {
        const { app } = this
        return {
            status: true,
            data: await app.mysql.select('fs_classify', {
                orders: [['id', 'desc']]
            })
        }
    }
}

module.exports = Classify