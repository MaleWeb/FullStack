let util = {};
// 格式化时间格式 y-m-d h:m:s
util.coverDate = (date) => {
    if (!date) return ''
    if (typeof date === 'string') {
        date = date.replace('T', ' ').replace(/\-/g, '/')
        date = new Date(date)
    }
    if(isNaN(date)){
        return '0000-00-00 00:00:00'
    }
    if (date.getFullYear) {
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
    return ""
}
util.getCookie = (cookieName) => {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for(var i = 0; i < arrCookie.length; i++){
        var arr = arrCookie[i].split("=");
        if(cookieName == arr[0]){
            return arr[1];
        }
    }
    return "";
}

module.exports = util;