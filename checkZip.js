/**
 * 检查zip文件是否损坏
 */
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
  
async function  checkZipFile(filename, corruptedFiles) {
  try {
    const zip = new AdmZip(filename);
    const zipEntries = zip.getEntries();
    console.log(`${filename} 通过`);
  } catch (error) {
    console.log(`${filename} 损坏`);
    corruptedFiles.push(filename); // 将损坏的文件添加到数组中
  }
}

const directory = './download';  // 替换为实际目录的路径
const corruptedFiles = [];

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const zipFiles = files.filter(file => path.extname(file) === '.zip');
  const startTime = +new Date()
  zipFiles.forEach(file => {
    const filename = path.join(directory, file);
    checkZipFile(filename, corruptedFiles);
  });
  const endTime = +new Date()
  const duration = endTime - startTime
  console.log(`检查文件完成，耗时：${duration / 1000}秒`);
  console.log('损坏的文件，建议删除后重新下载', corruptedFiles);
});