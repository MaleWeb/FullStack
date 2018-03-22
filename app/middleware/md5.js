const jsmd5 = require('js-md5')
module.exports = options => {
    return async function md5(ctx, next) {
        ctx.request.body.user_password = jsmd5(ctx.request.body.user_password)
        await next()
    };
};