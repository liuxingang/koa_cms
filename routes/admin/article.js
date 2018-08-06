/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-06 16:47:48
 */
var config = require('../../model/config')
var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools')
var multer = require('koa-multer');

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

router.get('/', async (ctx) => {
    let page = ctx.query.page || 1;
    let pageSize = ctx.query.pageSize || 10;

    // 查询总数量
    let count = await DB.count('article', {})

    let result = await DB.find('article', {}, {}, {
        page, 
        pageSize,
        sortJson: {
            add_time: -1
        }
    });
    let articleList = {
        list: result,
        page: page,
        pageSize: pageSize,
        totalPages: Math.ceil(count / pageSize)
    }
    await ctx.render('admin/article/list', {
        articleList
    })
})

router.get('/add', async (ctx) => {

    // 查询分类数据
    let cateList = await DB.find('articleCate', {});
    cateList = tools.cateToList(cateList)

    await ctx.render('admin/article/add', {
        cateList
    })
})


// 新增文章  'file'  和前端页面input  name 对应  (<input type="file"  name='img_url' placeholder="")
router.post('/doAdd', tools.multer().single('img_url'), async (ctx) => {
    let { pid, catename, title, description, author, status, is_best, is_hot, is_new, keywords, content } = ctx.req.body
    let img_url = ctx.req.file ? `/upload/${ctx.req.file.filename}` : '' 
    let add_time = new Date().toLocaleString()
    let json = {
        pid, catename, title, description, author,add_time, status, is_best, is_hot, is_new, keywords, content,img_url
    }
    let result = await DB.insert('article', json)
    if(result.result.ok) {
        ctx.redirect('/admin/article')
    }


})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;

    // 查询分类数据
    let cateList = await DB.find('articleCate', {});
    cateList = tools.cateToList(cateList)

    let result = await DB.find('article', { "_id": DB.getObjectId(id) });
    await ctx.render('admin/article/edit', {
        data: result[0],
        cateList
    })
})

// 编辑内容
router.post('/doEdit', upload.single('img_url'), async (ctx) => {
    let {id, pid, catename, title, description, author, status, is_best, is_hot, is_new, keywords, content } = ctx.req.body
    let img_url = ctx.req.file ? `/upload/${ctx.req.file.filename}` : '' 
    let add_time = new Date().toLocaleString()
    let json = {
        pid, catename, title, description, add_time, author, status, is_best, is_hot, is_new, keywords, content
    }
    if (img_url) {
        json.img_url = img_url
    }
    let result = await DB.update('article', {"_id": DB.getObjectId(id)}, json)
    if(result.result.ok) {
        ctx.redirect('/admin/article')
    }


})


module.exports = router.routes();