const Service = require('egg').Service;

class Comment extends Service {
    /**
     * 获取热门文章-分页
     * @param {number} offset 当前页 
     * @param {number} limit 条数
     */
    async index(obj) {
        let {ctx} = this;
        let limit = parseInt(obj.pageSize),
            offset = (parseInt(obj.pageIndex)-1) * limit;

        try{
            let total = await this.app.mysql.query('SELECT COUNT(*) total FROM fs_comment');
            let sql = '';
           if(obj.id){
               sql += 'WHERE c.id = '+obj.id
           }
            let list =  await this.app.mysql.query('SELECT c.*, a.article_title, u.user_name FROM fs_comment c JOIN fs_article a ON c.article_id = a.id JOIN fs_account u ON c.user_id = u.id '+ sql +' ORDER BY c.id DESC LIMIT ?,?', [offset, limit])            
            return {
                status:true,
                message:'获取评论列表成功',
                total:total[0].total,
                data: list,             
            }
        }catch(e){
            ctx.helper.errData(e);
        }
    }

    async getCommentByArticle(aid){
        let result = null;
        try{
            result = await this.app.mysql.query('SELECT * FROM fs_comment WHERE article_id = ?',[aid]);
            return {
                status : true,
                message: '获取评论成功',
                data : result                
            }
        }catch(e){
            ctx.helper.errData(e);
        }
    }

    async insertComment(obj){
        let {ctx, service} = this;
        let result = await this.app.mysql.insert('fs_comment', obj);
        if(result.affectedRows === 1){
            ctx.helper.insertLog(service,ctx,2,'创建评论');
            return {
                data: [],
                status:true,
                message: '创建成功'
            } 
        }else{
            ctx.helper.errData(null,'创建失败');
        }
    }

    async delComment(cid){
        let {ctx, service} = this;
        try{
            const result = await this.app.mysql.delete('fs_comment', {
                id: cid,
            });
            ctx.helper.insertLog(service,ctx,2,'删除评论');
            return {
                data:[],
                status:true,
                message:'删除成功'
            }
        }catch(e){
            ctx.helper.errData(e);
        }
    }
}

module.exports = Comment