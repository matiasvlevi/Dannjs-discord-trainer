module.exports = function getnum(label) {
  for (let i = 0 ;i < label.length; i++) {
    if (label[i] === 1) {
      if (i !== 10) {
        return i;
      } else {
        return 'empty'
      }
    }
  }
  return;
}