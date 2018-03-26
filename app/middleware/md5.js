const jsmd5 = require('js-md5')
module.exports = options => {
    return async function md5(ctx, next) {
        if(ctx.request.body.user_password){
            ctx.request.body.user_password = jsmd5(ctx.request.body.user_password)
        }
        if(ctx.request.body.new_password){
            ctx.request.body.new_password = jsmd5(ctx.request.body.new_password)
        }
        await next()
    };
};