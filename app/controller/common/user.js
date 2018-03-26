const Controller = require('egg').Controller;
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
/**
 * index,create,show,update,destory
 * 获取所有列表和分页 index get
 * 创建 create post
 * 获取某一个 show get
 * 更新 update put
 * 删除 destroy delete
 */
class CommonController extends Controller {
    // 获取所有用户列表
    async index() {
        const { ctx, service } = this
        ctx.body = await service.common.user.getUser();
    }
    // 删除用户
    async destroy() {
        const { ctx, service } = this
        ctx.body = await service.common.user.delUser()
    }
    // 更新用户信息
    async update() {
        const { ctx, service } = this
        ctx.body = await service.common.user.editUser()
    }
    // 获取单个用户详情
    async show() {
        const { ctx, service } = this
        ctx.body = await service.common.user.getUserDetail()
    }
    // 登录
    async sigin() {
        let { ctx, service } = this
        // 1、修改为 egg valide验证  ctx.validate(createRule);
        if (ctx.request.body.user_name == '' || ctx.request.body.user_password == '') {
            ctx.body = {
                status: false,
                message: '账号或密码错误'
            }
        } else {
            let data = await service.common.user.sigin(ctx.request.body);
            if (data.data) {
                const role = await service.admin.userNav.getAuth(data.data);
                data.data.navs = ctx.helper.toTree(role);
                const apis = await service.admin.userApi.getApis(data.data);
                data.data.apis = apis;
            }
            ctx.body = data;
        }
    }
    // 后台注册
    async create() {
        const { ctx, service } = this
        if (ctx.request.body.user_name == '' || ctx.request.body.user_password == '') {
            ctx.body = {
                status: false,
                message: '注册失败'
            }
        } else {
            let data = await service.common.user.signUp(ctx.request.body);
            ctx.body = data;
        }
    }

    async exit() {
        const { ctx, service } = this
        ctx.helper.insertLog(service, ctx, 1, '退出登录');
        let data = await service.common.user.exit(ctx.request.body);
        ctx.body = data;
    }

    //发送邮箱验证码
    async sendEmail() {
        const { ctx, service } = this
        let reg = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$");
        if (!reg.test(ctx.request.body.email)) {
            ctx.body = {
                status: false,
                message: '邮箱格式错误'
            }
        } else {
            let result = await service.common.user.sendEmail(ctx.request.body);
            if (result.status) {
                let emailCode = ctx.helper.randomString(6);
                let transport = nodemailer.createTransport(smtpTransport({
                    service: 'QQ',
                    auth: {
                        user: '453819567@qq.com',
                        pass: 'zjquqadrygurbifc'
                    }
                }));
                let em = function(ctx){
                    const promise = new Promise((resolve, reject) => {
                        transport.sendMail({
                            from: '453819567@qq.com',
                            to: ctx.request.body.email,
                            subject: 'egg',
                            html: `<h2>蛋蛋</h2><p>邮箱验证码为<strong>${emailCode}</strong></p>`
                        }, function (error, response) {
                            if (error) {
                                reject(error);
                                transport.close();
                                ctx.body = {
                                    status: false,
                                    message: '发送失败'
                                }
                            } else {
                                resolve(response)
                                transport.close();
                                
                            }
                        });
                    })
                    return promise
                }
                await em(ctx);
                ctx.cookies.set('emailCode', emailCode, {
                    maxAge: 1000 * 60 * 2,
                    httpOnly: true,
                    encrypt: true,
                    overwrite: true,
                });
                ctx.cookies.set('email', ctx.request.body.email, {
                    maxAge: 1000 * 60 * 2,
                    httpOnly: true,
                    encrypt: true,
                    overwrite: true,
                });
                ctx.helper.insertLog(service, ctx, 2, '发送邮件给' + ctx.request.body.email);
                ctx.body = {
                    status: true,
                    message: '发送邮件成功，请注意查收'
                }
                

            } else {
                if(ctx.request.body.type){
                    ctx.body = {
                        status: false,
                        message: "此邮箱已注册"
                    }
                }else{
                    ctx.body = {
                        status: false,
                        message: "此邮箱未注册"
                    }
                }
            }
        }
    }
    //前台注册
    async register() {
        const {
            ctx,
            service
        } = this;
        let data = ctx.request.body;
        let reg = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$");
        if (!reg.test(data.email)) {
            ctx.body = {
                status: false,
                message: '邮箱格式错误'
            }
        } else if (data.email === '' || data.emailCode === '' || data.name === '' || data.user_password === '') {
            ctx.body = {
                status: false,
                message: '请完善注册信息'
            }
        } else {
            if (reg.test(data.name)) {
                ctx.body = {
                    status: false,
                    message: '用户名不能为邮箱'
                }
            } else {
                ctx.body = await service.common.user.register(data);
            }
        }
    }
    //前台登录
    async login() {
        const {
            ctx,
            service
        } = this;
        let data = ctx.request.body;
        if (data.name === '' || data.user_password === '') {
            ctx.body = {
                status: false,
                message: '账号或密码错误'
            }
        } else {
            ctx.body = await service.common.user.login(data);
        }
    }
    //前台重置密码
    async resetPassword() {
        const { ctx, service } = this
        ctx.body = await service.common.user.resetPassword(ctx.request.body);
    }
    //找回密码
    async findPassword() {
        const { ctx, service } = this
        let reg = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$");
        if (!reg.test(ctx.request.body.email)) {
            ctx.body = {
                status: false,
                message: '邮箱格式错误'
            }
        } else {
            ctx.body = await service.common.user.findPassword(ctx.request.body);
        }
    }
}

module.exports = CommonController;