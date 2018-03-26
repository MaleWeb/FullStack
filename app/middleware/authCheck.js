module.exports = (options, app) => {
    return async function (ctx, next) {

        if (ctx.url != '/api/sigin' && ctx.session.user) {
            const apis = ctx.session.user.apis;
            const method = ctx.method.toLowerCase();
            if (method != 'get') {
                const params = ctx.params;
                for (let i = 0, len = apis.length; i < len; i ++) {
                    const api = apis[i];
                    const address = ctx.url;
                    if (api.method === method && address.indexOf(api.address) > -1) {
                        await next();
                        return;
                    }
                }
                ctx.throw(403);
                return;
            }
        }
        await next();
    }
}