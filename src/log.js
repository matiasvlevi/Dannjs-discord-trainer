let oldlog = console.log;

module.exports = function log(x) {
  oldlog('\x1b[32m' + new Date().toString().slice(4,24)+' >>>  '+x+'\x1b[0m');
  return;
};