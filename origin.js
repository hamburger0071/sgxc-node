const axios = require('axios');
const fs = require('fs');

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

const urlPrefix = 'https://media.everphoto.cn/origin/';
const folderPath = './2015-10-16'; // 要保存到的文件夹路径

const imageIds = [
  "6582214572030050830"
]; // 图片ID列表

// 如果文件夹不存在，创建文件夹
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// 异步下载并保存每张图片
Promise.all(imageIds.map(async (id, index) => {
  const imageUrl = urlPrefix + id;
  const localPath = `${folderPath}/image${index + 1}.jpg`;

  try {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      headers: {
        'cookie': cookie,
      }
    });
    response.data.pipe(fs.createWriteStream(localPath))
      .on('finish', function () {
        console.log(`图片${index + 1}下载完成`);
      })
      .on('error', function (err) {
        console.error(`下载图片${index + 1}出错:`, err);
      });
  } catch (err) {
    console.error(`下载图片${index + 1}出错:`, err);
  }
}))
  .then(function () {
    console.log('所有图片下载完成');
  })
  .catch(function (err) {
    console.error('下载过程中出错:', err);
  });