module.exports = options => {
    return async function gzip(ctx, next) {
      let rootReg = /^\/$/;
      let sig = /^(\/api\/sigin)|(\/api\/signUp)|(\/public(\/.+)?)|((\/public\/js)?\/admin(\/.+)?)|((public\/js)?\/home(\/.+)?)/;
      let url = ctx.url;
      console.log(url);
      if(rootReg.test(url) || sig.test(url)){
        await next();
      }else{   
        if(!ctx.session.user){
          // 未登录
          ctx.body = {
            data:[],
            isLogin:false,
            status: false,
            message: '请重新登录'
          }
        }else{
          // 已登录
          await next();
        }
      }
    };
};