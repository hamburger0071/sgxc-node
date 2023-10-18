const fs = require('fs');

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 查看文件是否存在 */
const checkFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false)
        return;
      }
      resolve(true)
    })
  })
}

module.exports = {
  sleep,
  checkFile
};