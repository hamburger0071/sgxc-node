// ==UserScript==
// @name         时光相册提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://web.everphoto.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  openindexedDB()
  function openindexedDB() {
    // 创建或打开数据库
    let request = indexedDB.open('everphoto', 10);
    // 数据库被成功打开
    let allData = []
    request.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction('media', 'readonly');
      let objectStore = transaction.objectStore('media');
      // 打开游标
      let request = objectStore.openCursor();
      request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
          let data = cursor.value;
          data.sortDate = data.generated_at.toISOString().split('T')[0]
          allData.push(data)
          // 处理数据
          cursor.continue();
        }
      };

      transaction.oncomplete = function (event) {
        transformToMapWithKeys(allData, 'sortDate')
        console.log('%c [ allData ]-39', 'font-size:13px; background:pink; color:#bf2c9f;', allData)
        db.close();
      };
    }
  }


  function transformToMapWithKeys(objects, keyProperty) {
    const keys = [];
    const result = objects.reduce((acc, curr) => {
      const key = curr[keyProperty];
      if (!acc[key]) {
        acc[key] = [curr.id];
        keys.push(key);
      } else if (Array.isArray(acc[key])) {
        acc[key].push(curr.id);
      } else {
        acc[key] = [acc[key], curr.id];
      }
      return acc;
    }, {});
    console.log('%c [ result ]', 'font-size:13px; background:pink; color:#bf2c9f;', result)
    console.log('%c [ keys ]', 'font-size:13px; background:pink; color:#bf2c9f;', keys)

    setTimeout(() => {
      const currentUser = document.querySelector('.current-user')
      var firstChild = currentUser.firstChild;

      const btnInfo = document.createElement('div')
      btnInfo.innerText = '下载info.json'
      btnInfo.className = 'button '
      // 设置内联样式
      btnInfo.style.color = "#044cf3";
      btnInfo.style.fontWeight = "bold";
      btnInfo.style.cursor = 'pointer'
      btnInfo.style.marginRight = '20px'
      btnInfo.style.lineHeight = '36px'
      currentUser.insertBefore(btnInfo, firstChild)
      btnInfo.onclick = function () {
        const jsonData = JSON.stringify(result);
        downloadData(jsonData, 'info.json');
      }


      const btnKeys = document.createElement('div')
      btnKeys.innerText = '下载Keys.json'
      btnKeys.className = 'button '
      // 设置内联样式
      btnKeys.style.color = "#044cf3";
      btnKeys.style.fontWeight = "bold";
      btnKeys.style.cursor = 'pointer'
      btnKeys.style.marginRight = '20px'
      btnKeys.style.lineHeight = '36px'
      currentUser.insertBefore(btnKeys, firstChild)

      btnKeys.onclick = function () {
        const jsonData = JSON.stringify(keys);
        downloadData(jsonData, 'keys.json');
      }


      const btnCookie = document.createElement('div')
      btnCookie.innerText = '下载cookie'
      btnCookie.className = 'button '
      // 设置内联样式
      btnCookie.style.color = "#044cf3";
      btnCookie.style.fontWeight = "bold";
      btnCookie.style.cursor = 'pointer'
      btnCookie.style.marginRight = '20px'
      btnCookie.style.lineHeight = '36px'
      currentUser.insertBefore(btnCookie, firstChild)

      btnCookie.onclick = function () {
        const jsonData = JSON.stringify(document.cookie);
        downloadData(jsonData, 'cookie.txt');
      }
    }, 2000)
    return { map: result, keys };
  }

  function downloadData(data, filename) {
    const blobData = new Blob([data]);  // 创建Blob对象
    const url = URL.createObjectURL(blobData);  // 创建临时URL

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();  // 触发下载

    URL.revokeObjectURL(url);  // 释放资源
  }
})();