const Service = require('egg').Service;

class BackIndex extends Service {
    async sigin(data){
        let flag = await this.app.mysql.get('fs_account',data);
        return flag;
    }
    async delete(data){
        const ctx = this.ctx;
        const flag = await this.app.mysql.get('fs_account',{id:data.userId});
        if(flag !== null){
            const result = await this.app.mysql.delete('fs_account',{id:data.userId});
            if(result.affectedRows===1){
                ctx.session = null;
                return {
                    status : true,
                    message : '账户已删除'
                }
            }else{
                return {
                    status : false,
                    message : '账户删除失败'
                }
            }
        }else{
            return {
                status : false,
                message : '账户不存在'
            }
        }
        
    }
    async updateRoles(data){
        const ctx = this.ctx;
        const flag = await this.app.mysql.get('fs_account',{id:data.targetId});
        if(flag !== null){
            const result = await this.app.mysql.update('fs_account',{id:data.targetId,role_id:data.roleId});
            if(result.affectedRows===1){
                return {
                    status : true,
                    message : '账户角色修改成功',
                    roleId : data.roleId,
                }
            }else{
                return {
                    status : false,
                    message : '账户角色修改失败',
                }
            }
        }else{
            return {
                status : false,
                message : '账户不存在',
            }
        }
    }
}

module.exports = BackIndex