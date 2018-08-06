/* 配置文件*/

var path = require('path')
var app = {
    dbUrl: 'mongodb://127.0.0.1:27017/',
    dbName: 'koa',
    /* 图片存放路径放在项目同级目录下 提前建立koa_cms_upload/upload 文件夹，
    
    文件实际存放在upload下
    app.use(static(config.uploadPath))
    这样图片下的访问路径为/upload/1.png
    */ 
    uploadPath: path.join(__dirname, '../../koa_cms_upload/upload') , 
    /* 富文本图片上传地址 富文本路径会自动到 koa_cms_upload 下的upload文件加下*/
    uploadUeditorPath: path.join(__dirname, '../../koa_cms_upload')  
}

module.exports = app;