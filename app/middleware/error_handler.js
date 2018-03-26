module.exports = (options, app) => {
    return async function (ctx, next) {
        try {
            if (ctx.request.body !== '{}') {
                for (let key in ctx.request.body) {
                    if (key.indexOf("{") != -1) {
                        ctx.request.body = JSON.parse(key)
                    }
                }
            }
            await next()
        } catch (err) {
            app.emit('error', err, this);
            const status = err.status || 500
            // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
            const error = status === 500 && app.config.env === 'prod' ?
                'Internal Server Error' :
                err.message
            console.log("_______________________________________error____________________________________________")
            console.log(err)
            // 从 error 对象上读出各个属性，设置到响应中
            ctx.body = {
                status: false,
                error: error
            }
            if (status === 422) {
                ctx.body = {
                    status: false,
                    error: err.errors
                }
            }
            ctx.status = 200
        }
    }
}