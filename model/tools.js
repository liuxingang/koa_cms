var md5 = require('md5');
var config  = require('./config')
var multer = require('koa-multer');

let tools = {
    multer() {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                //   cb(null, 'public/upload')  /* 上传图片目录 目录必须存在   前端form 必须设置 enctype="multipart/form-data"*/
                cb(null, config.uploadPath)  /* 上传图片目录 目录必须存在   前端form 必须设置 enctype="multipart/form-data"*/
            },
            filename: function (req, file, cb) { /* 图片上传完成 */
                var fileFormat = (file.originalname).split(".") /* 获取后缀名 */
                cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]); /* 大地代码 */
            }
        })
        
        var upload = multer({ storage: storage })

        return upload
    },
    md5(str) {
        return md5(str)
    },
    cateToList(data) {
        let firstArr = [];
        // 一级分类
        for (let i = 0; i < data.length; i++) {
            if( data[i].pid == 0){
                firstArr.push(data[i]);
            }
        }

        // 二级分类
        for (let i = 0; i < firstArr.length; i++) {
            firstArr[i].list = [];

            for (let j = 0; j < data.length; j++) {
                if( firstArr[i]._id == data[j].pid){
                    firstArr[i].list.push(data[j]);
                }
            }
        }

        return firstArr;
    }
}

module.exports = tools