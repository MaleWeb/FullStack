exports.static = true;

exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr'
};
exports.serviceworker = {
  enable: true,
  package: 'egg-serviceworker'
};

exports.mysql = {
  enable: true,
  package: 'egg-mysql'
}

exports.validate = {
  enable: true,
  package: 'egg-validate'
}

exports.session = {
  enable: true,
  package: 'egg-session'
}