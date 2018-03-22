//  基于axios 封装的http请求插件
import axios from 'axios';

const errorObj = {
  200: '服务器成功返回用户请求的数据',
  201: '用户成功新建或者修改数据',
  204: '用户成功删除数据',
  400: '用户发出的请求有错误',
  401: '表示用户没有权限（令牌、用户名、密码错误）',
  403: '表示用户得到授权（与401相对），但禁止访问',
  404: '不存在',
  406: '用户请求的格式不存在（比如用户请求JSON格式，但只有XML格式）',
  410: '用户请求的资源被永久删除，且不会再得到的',
  422: '创建一个对象时放生验证错误',
  500: '服务器发生错误，用户将无法判断发出的请求是否成功'
};

const getCookie = name => {
  const cookieString = document.cookie;
  let value = '';
  if (cookieString) {
    const cokies = document.cookie.replace(/\s/g, '').split(';').map(item => {
      const keyValue = item.split('=');
      if (keyValue[0] === name) {
        value = keyValue[1];
      }
      return null;
    });
  }
  return value;
};

axios.defaults.timeout = 10000;
axios.defaults.baseURL = window.location.protocol + '//' + window.location.hostname + ':7001'; // 请求默认的地址
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; // 设置默认请求头
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'; // 设置默认允许的请求地址

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers['x-csrf-token'] = getCookie('csrfToken'); // 设置默认允许的请求地址
  return config;
}, err => {
  return Promise.reject(err);
});

/**
 * 看需求是否需要添加响应拦截器
 */

axios.interceptors.response.use(response => {
  return response;
}, err => {
  // console.log(err);
  if (err.response) {
    const status = err.response.status;
    err.response.data.Message = errorObj[status];
    return Promise.reject(new Error(err.response.data));
  } else {
    return Promise.reject(new Error(err.message));
  }
});


/**
 * @param  {string} url
 * @param  {object} params={}  参数可以根据需要自行处理
 */
const fetch = (url, params = {}) => {
  const str = Object.keys(params).map(item => {
    return item + '=' + params[item];
  }).join('&');
  return new Promise((resolve, reject) => {
    axios.get(url + '?' + str).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
};

/**
 * @param  {string} url
 * @param  {object} data={} 参数可以根据需要自行处理

 */
const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
};

/**
 * @param  {string} url
 * @param  {object} data={} 参数可以根据需要自行处理
 */
const put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
};

/**
 * @param  {string} url
 * @param  {object} params={}
 */

const del = (url) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, {}).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    });
  });
};


/**
 * 以下这种方式需要调用Vue.use方法 调用的时候调用 this.$fetch, this.$post, this.$axios, this.$put, this.$del 方法
 */
export default {
  install(Vue, Option) {
    const data = { axios, fetch, post, put, del };
    Object.keys(data).map(item => Object.defineProperty(Vue.prototype, '$' + item, { value: data[item] }));
  }
};

/**
 * 也可以直接暴露出一个对象，区对应的方法调用
 */
// export default { axios, fetch, post, put, del }