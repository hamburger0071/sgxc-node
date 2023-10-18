
# 时光相册按日期下载图片、视频

# 1.浏览器安装油猴脚本
在油猴中添加脚本，把youhou.js放入

# 2.打开时光相册web网站 https://web.everphoto.cn/ 并登录

右上角会多出下载info.json、下载Keys.json、下载cookie按钮

想保存原始数据的可以 下载原始数据按钮

# 3.把这3个文件复制到项目中

# 4.安装依赖

没有nodejs环境的先安装nodejs https://nodejs.org/en

安装好nodejs后运行 npm install

# 5.运行
node index.js

下载完成的文件会放在download文件夹中

# 6.可使用checkZip.js检查压缩文件是否损坏

node checkZip.js

