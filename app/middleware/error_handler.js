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
            const code = {
                400: '请求错误',
                401: '没有权限',
                403: '禁止访问',
                404: '资源不存在',
                406: '请求的格式不存在',
                410: '资源被永久删除',
                422: '创建一个对象时发生验证错误',
                500: '服务器发生错误'
            }
            app.emit('error', err, this)
            ctx.body = {
                error: code[ctx.status]
            }
            if (ctx.status === 422) {
                ctx.body.detail = err.errors
            }
            ctx.status = 200
        }
    }
}