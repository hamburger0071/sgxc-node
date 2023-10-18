/**
 * 解压文件
 */
const compressing = require('compressing');
const fs = require('fs');
const path = require('path');

function decompressFile(sourceFilePath, destinationFolderPath) {
  // 创建一个可读流
  const readStream = fs.createReadStream(sourceFilePath);

  // 获取源文件的基本名称（仅文件名，不包括路径和扩展名）
  const baseName = path.basename(sourceFilePath, path.extname(sourceFilePath));

  // 创建目标文件夹路径
  const targetFolder = path.join(destinationFolderPath, baseName);
  fs.mkdirSync(targetFolder, { recursive: true });


  compressing.zip.uncompress(sourceFilePath, targetFolder).then(res => {
    console.log(111);
  }).catch(err => {
    console.log(222);
    console.log(err);
  })
  
}

// 调用解压方法
const sourceFilePath = './download/2023-07-02.zip';
const destinationFolderPath = './decompress';
decompressFile(sourceFilePath, destinationFolderPath);



