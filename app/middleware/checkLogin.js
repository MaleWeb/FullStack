module.exports = options => {
    return async function gzip(ctx, next) {
      let rootReg = /^\/$/;
      let sig = /^(\/api\/sigin)|(\/api\/signUp)|(\/api\/login)|(\/api\/register)|(\/public(\/.+)?)|((\/public\/js)?\/admin(\/.+)?)|((public\/js)?\/home(\/.+)?)/;
      let url = ctx.url;
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
          console.log("loginTime__________________________________________")
          console.log(ctx.session.user.loginTime)
          const time = new Date(ctx.session.user.loginTime).getTime()
          const curTime = new Date().getTime()
          const lineTime = Math.round(curTime-time) // 小时
          // 已登录
          await next();
        }
      }
    };
};