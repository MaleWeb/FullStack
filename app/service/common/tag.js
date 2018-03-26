const Service = require('egg').Service;

class Tag extends Service {
    //获取所有tags
    async getTag(){
        const { ctx, app } = this;
        let result =  await app.mysql.query('SELECT * FROM fs_tags');
        return ctx.body = {
            data: result===null?[]:result,
            status : true,
        }
    }
    /**
     * 删除tag
     * @param {number} id  标签id
     */
    async delTag(id){
        const { ctx, app, service } = this;
        const result = await app.mysql.delete('fs_tags',{
            id: id
        })
        if (result.affectedRows === 1) {
            ctx.helper.insertLog(service, ctx, 2, '删除标签');
            return {
                status: true,
                message: "删除标签成功"
            }
        } else {
            return {
                status: false,
                message: "删除标签失败"
            }
        }
    }
    /**
     * 添加标签
     * @param  {number} classify  分类
     */
    async addTag(data) {
        const { ctx, app, service } = this;
        const row = await app.mysql.get('fs_tags', { tag_name: data.tagName });
        if(row === null){
            const result = await app.mysql.insert('fs_tags', 
                {
                    tag_name:data.tagName,
                    tag_icon:data.tagIcon,
                    classify_id:data.classify,
                }
            );
            if (result.affectedRows === 1) {
                ctx.helper.insertLog(service, ctx, 2, '添加标签');
                return {
                    status: true,
                    message: '添加标签成功'
                }
            } else {
                return {
                    status: true,
                    message: '添加标签失败'
                }
            }
        }else{
            return {
                status: false,
                message: "此标签已存在"
            }
        }
    }
}
module.exports = Tag