//  基于axios 封装的http请求插件
import axios from 'axios';

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
    return Promise.reject(new Error(err.response.data));
  } else {
    console.log('Error: ', err);
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
    let address = url;
    if (str) {
      address += '?' + str;
    }
    axios.get(address).then(res => {
      resolve(res.data);
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
      resolve(res.data);
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
      resolve(res.data);
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
      resolve(res.data);
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