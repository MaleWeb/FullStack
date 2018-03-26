const Service = require('egg').Service;

class Log extends Service {
    // 获取用户列表
    async getLogList(data) {
        let {ctx} = this;
        let uid = data.id ? data.id : '';
        let username = data.user_name ? data.user_name : '';
        let offset = (parseInt(data.pageIndex) - 1) * parseInt(data.pageSize);
        let limit = parseInt(data.pageSize);
        let state = parseInt(data.state);

        let total = await this.app.mysql.query('SELECT COUNT(*) total FROM fs_operation_logs WHERE operation_state=?',[state])
        let sql = ctx.helper.handleRequest({
            data:{
                id:uid,
                operation_state:state,
                user_name:username
            },
            like:['user_name'],
            alias:'g'
        });
        return { 
            data:await this.app.mysql.query(
                `SELECT g.id,g.user_id,g.user_name,g.operation_ip,g.operation_method,g.operation_desc,g.operation_url,g.operation_time FROM fs_operation_logs g `+ sql +` ORDER BY operation_time  DESC LIMIT ?,?;`,
                [offset, limit]),
            total:total[0].total,
            status:true
        }            
    }

    //存储日志
    async saveLog(data){
        let obj = Object.assign({
            user_id: 1,
            user_name: '游客',
            operation_ip: '127.0.0.1',
            operation_url: '/',
            operation_desc: '操作',
            operation_method: 'GET',
            operation_time: new Date(),
            operation_state: 2,
        },data);
        this.app.mysql.insert('fs_operation_logs',obj);
    }

}

module.exports = Log