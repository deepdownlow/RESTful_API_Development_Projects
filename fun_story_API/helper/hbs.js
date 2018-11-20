const moment = require('moment')

module.exports = {
 truncate: (str, len) => {
  if (str.length > len && true.length > 0) {
   const newStr = str + ' '
   newStr = str.substr(0, len)
   newStr = str.substr(0, newStr.indexOf(' '))
   newStr = (newStr.length > 0) ? newStr : str.substr(0, len)
   return `${newStr} ...`
  }
  return str
 },
 noTag: input => input.replace(/<(?:.|\n)*?>/gm, ''),
 formatTime: (date, format) => moment(date).format(format)
}