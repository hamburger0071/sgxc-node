const info = require('./info.json')

const keys = require('./keys.json')
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/** 填写cookie */
const cookie = ''

let currIdx = 0
const failFiles = [];
const axiosAndDownload = async (idx) => {
  const name = keys[idx]
  const filePath = `./download/${name}.zip`;

  const is = await checkFile(filePath)
  if (!is) {
    // 创建一个空的FormData对象
    const formData = new FormData();
    formData.append('media', info[name].join('-'));
    const config = {
      headers: {
        'cookie': cookie,
      }
    };
    // 发送POST请求
    console.log(`正在下载${idx}/${keys.length}，${name}.zip`);
    const startTime = +new Date()
    axios.post('https://web.everphoto.cn/api/media/archive', formData, config)
      .then(async (response) => {
        await sleep(5000)
        downloadFile(response.data.data.url, name)
      }).catch((err) => {
        const tip = `${name}.zip，下载失败，时光相册错误通知：${err.response.data.message}`
        console.log(tip)
        currIdx += 1
        failFiles.push(tip)
        if (currIdx < keys.length) {
          axiosAndDownload(currIdx)
        } else {
          console.log(`全部文件下载完成`);
          failFiles.length && writeFile(failFiles)
        }
      })

    const downloadFile = async (url, name) => {
      // 获取目录路径
      const dirPath = path.dirname(filePath);
      axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: config.headers
      })
        .then(async (response) => {
          const endTime = +new Date()
          const duration = endTime - startTime
          response.data.pipe(fs.createWriteStream(filePath));
          console.log(`${name}.zip文件下载完成，耗时：${duration / 1000}秒`);
          currIdx += 1
          if (currIdx < keys.length) {
            axiosAndDownload(currIdx)
          } else {
            console.log(`全部文件下载完成`);
          }
        })
        .catch((error) => {
          const tip = `${name}.zip文件下载失败，可稍后重新运行`
          console.log(tip)
          failFiles.push(tip)
          console.error(tip);
          currIdx += 1
          if (currIdx < keys.length) {
            axiosAndDownload(currIdx)
          } else {
            console.log(`全部文件下载完成`);
            failFiles.length && writeFile(failFiles)
          }
        });
    }
  } else {
    currIdx += 1
    if (currIdx < keys.length) {
      axiosAndDownload(currIdx)
      // console.log(`${keys[idx]}.zip存在，跳过，不下载`);
    } else {
      console.log(`全部文件下载完成`);
      failFiles.length && writeFile(failFiles)
    }
  }
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
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const writeFile = (data) => {
  const text = +new Date()
  const filePath = `./log/${text}.txt`;
  // 将变量值写入文件
  fs.writeFile(`${filePath}`, data.join('\n'), (err) => {
    if (err) throw err;
  
    console.log(`错误日志文件：${filePath}`);
  });
}
axiosAndDownload(currIdx)




