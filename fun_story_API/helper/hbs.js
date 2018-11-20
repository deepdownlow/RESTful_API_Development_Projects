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
 formatTime: (date, format) => moment(date).format(format),
 editIcon: (storyUser, logUser, storyId, floating= true) => {
  if(storyUser == logUser) {
   if(floating) {
    return `<a href='/stories/edit/${storyId}' class='btn-floating halfway-fab indigo darken-4'><i class="fas fa-pencil-alt"></i></a>`
   } else {
    return `<a href='/stories/edit/${storyId}'><i class="fas fa-pencil-alt"></i></a>`
   }
  } else {
     return ''
  }
 }
}