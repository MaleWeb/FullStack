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
        for (let i = 0; i < parent.length; i++) {
            let item = parent[i];
            item.children = [];
            if (item.pid) {
                children.push(item);
                parent.splice(i, 1);
                i--;
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
            for (let i = 0; i < children.length; i++) {
                if (item.id === children[i].pid) {
                    item.children.push(children[i]);
                    children.splice(i, 1);
                    i--;
                }
            }
            if (item.children.length) {
                exports.toTree(item.children, children)
            }
        })
    }
    return parent;
}

exports.insertLog = (service, ctx, state, desc) => {
    if (!ctx.session.user || !ctx.session.user.user_name) {
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

exports.errData = (e, msg) => {
    let emsg = e ? e.message : '操作失败';
    return {
        data: [],
        status: false,
        message: msg || emsg
    }
}

/**
 * 处理请求拼接sql条件
 * @param {object} body 请求体参数
 * @param {string} alias 别名
 */
exports.coverRequest = (body, alias) => {
    let [pageIndex, pageSize, sortName, sortOrder] = [1, 10, 'id', 'ASC'];
    const [exMin, exMax, exNum, keys, values] = [/Min/g, /Max/g, /id|type|state|status|email|grade/g, [], []];
    alias = alias ? alias + '.' : '';
    if (body.pageIndex) {
        pageIndex = body.pageIndex;
        delete body.pageIndex;
    }
    if (body.pageSize) {
        pageSize = body.pageSize;
        delete body.pageSize;
    }
    if (body.sortName) {
        sortName = body.sortName;
        delete body.sortName;
    }
    if (body.sortOrder) {
        sortOrder = body.sortOrder;
        delete body.sortOrder;
    }
    const Min = (pageIndex - 1) * pageSize;
    const Max = pageSize * 1;
    Object.keys(body).map(item => {
        const value = body[item];
        if (value === '' || value === null) {
            return;
        }
        if (exMin.test(item)) {
            keys.push(alias + item.replace(exMin, '') + ' >= ?');
            values.push(value);
        } else if (exMin.test(item)) {
            keys.push(alias + item.replace(exMax, '') + ' <= ?');
            values.push(value);
        } else if (exNum.test(item)) {
            keys.push(alias + item + ' = ?');
            let number = Number(value);
            if (number === number) {
                values.push(Number(value));
            } else {
                number.push(value);
            }
        } else {
            keys.push(alias + item + ` LIKE '%${value}%'`);
        }
    })
    values.push(sortName, sortOrder, Min, Max);
    const query = `${keys.length ? ' WHERE ' + keys.join(' AND ') : ''} ORDER BY ? ? LIMIT ?, ?`;
    const count = `${keys.length ? ' WHERE ' + keys.join(' AND ') : ''}`;
    return {
        query,
        values,
        count
    }
}


/**
 * 处理请求拼接sql条件
 * @param {object} options.data 请求体
 * @param {array} options.like 模糊查询字段
 * @param {string} options.alias 别名
 */

exports.handleRequest = (options) => {
    let txt = 'WHERE '
    let data = Object.assign({}, options.data)
    let like = options.like || false
    let alias = options.alias ? options.alias + "." : ""

    data.pageIndex && delete data.pageIndex
    data.pageSize && delete data.pageSize

    for (let key in data) {
        if (!data[key]) delete data[key]
    }

    const num = Object.getOwnPropertyNames(data).length
    let andTxt = num > 1 ? " AND " : ""
    Object.keys(data).map((item, inx) => {
        if (data[item]) {
            (num - 1) === inx && (andTxt = "")
            let isKey = false
            like && like.map(cur => {
                if (item === cur) {
                    txt += alias + item + ' LIKE \'%' + data[item] + '%\' ' + andTxt
                    isKey = true
                }
            })
            !isKey && (txt += alias + item + '=' + data[item] + andTxt)
        }
    })
    return (txt === 'WHERE ' ? '' : txt)
}
/**
 * 生成随机验证码
 * 
 */
exports.randomString = (len)=> {
　　len = len || 6;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
