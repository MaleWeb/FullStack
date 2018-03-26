module.exports = (options) => {
    return async function saveSession(ctx, next) {
      await next();
      // 如果 Session 是空的，则不保存
      if (!ctx.session.user) return;
      ctx.session.save();
    };
};