const info = require('./info.json')
const keys = require('./keys.json')
const axios = require('axios');
const fs = require('fs');
const utils = require('./utils.js');
const path = require('path');

/** 填写cookie */
let cookie = ''

if (!cookie) {
  // 读取txt文件的路径
  const filePath = './cookie.txt';
  try {
    // 使用fs.readFileSync方法同步读取文件内容
    const data = fs.readFileSync(filePath, 'utf-8');
    cookie = data.replace(/^"|"$/g, "")
  } catch (err) {
    console.error('读取cookie文件时出错:', err);
  }
}
let currIdx = 0
const failFiles = [];
const axiosAndDownload = async (idx) => {
  const name = keys[idx]
  const filePath = `./download/${name}.zip`;

  const is = await utils.checkFile(filePath)
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
        await utils.sleep(5000)
        downloadFile(response.data.data.url, name)
      }).catch((err) => {
        const tip = `${name}.zip，下载失败，时光相册错误通知：${err.response.data.message}`
        console.log(tip)
        currIdx += 1
        failFiles.push(tip, 'mediaIds:' + info[name])
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
          failFiles.push(tip, 'mediaIds:' + info[name])
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

const writeFile = (data) => {
  const text = +new Date()
  const filePath = `./log/${text}.txt`;
  // 将变量值写入文件
  fs.writeFile(`${filePath}`, data.join('\n'), (err) => {
    if (err) throw err;

    console.log(`错误日志文件：${filePath}`);
  });
}

if (cookie) {
  axiosAndDownload(currIdx)
} else {
  console.log('cookie为空，请设置或者复制下载的cookie.txt到根目录');
}




