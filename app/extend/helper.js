/**
 * 格式化时间
 * @param {date} date
 * @returns {string} 时间字符串 yyyy-MM-dd hh:mm:ss
 */
exports.coverDate = date => {
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds()
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
    h = h > 9 ? h : '0' + h
    m = m > 9 ? m : '0' + m
    s = s > 9 ? s : '0' + s
    return year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
}

/**
 * 转换时间格式
 * @param {object} helper APP的helper
 * @param {string} date "2018-03-15T04:20:00.000Z"
 * @returns {string} 时间字符串 yyyy-MM-dd hh:mm:ss
 */
exports.formatDate = (helper, date) => {
    let _date = new Date(date)
    return helper.coverDate(_date)
}

exports.toTree = (parent, children) => {
    if (!children) {
        children = [];
        for(let i = 0; i < parent.length; i ++) {
            let item = parent[i];
            item.children = [];
            if (item.pid) {
                children.push(item);
                parent.splice(i, 1);
                i --;
            }
        }
        if (parent.length) {
            exports.toTree(parent, children);
        }
    } else {
        if (!children.length) {
            return;
        }
        parent.map(item => {
            for(let i = 0; i < children.length; i ++) {
                if (item.id === children[i].pid) {
                    item.children.push(children[i]);
                    children.splice(i, 1);
                    i --;
                }
            }
            if (item.children.length) {
                exports.toTree(item.children, children)
            }
        })
    }
    return parent;
}

exports.insertLog = (service,ctx,state,desc) => {   
    if(!ctx.session.user || !ctx.session.user.user_name){
        console.log('****** 没有用户信息，插入日志失败 ******');
        return false;
    }
    service.admin.log.saveLog({
        user_id: ctx.session.user.id || '',
        user_name: ctx.session.user.user_name,
        operation_ip: ctx.ip,
        operation_url: ctx.url,
        operation_method: ctx.method,
        operation_desc: desc,
        operation_state: state
    })
}