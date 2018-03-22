const path = require('path');
const fs = require('fs');
module.exports = app => {
  const exports = {};

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico'))
  };

  exports.view = {
    cache: false
  };

  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      basedir: path.join(app.baseDir, 'app/view')
    }
  };

  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs')
  };

  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  };

  exports.keys = '123456';

  exports.middleware = [
    'access', 'errorHandler','checkLogin'
  ];

  exports.mysql = {
    client: {
      host: '192.168.5.59',
      port: '3306',
      user: 'root',
      password: 'aa123456',
      database: 'fullstack'
    },
    app: true,
    agent: false
  }

  exports.session = {
    maxAge: 30 * 60 * 1000, // ms
    key: 'EGG_SESS',
    httpOnly: true,
    encrypt: true,
  };
  return exports;
};
