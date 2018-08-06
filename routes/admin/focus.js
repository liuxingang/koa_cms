/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-06 17:01:32
 */
var config = require('../../model/config')
var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools')


router.get('/', async (ctx) => {
   

    let focusList = await DB.find('focus', {});

    await ctx.render('admin/focus/list', {
        focusList
    })
})

router.get('/add', async (ctx) => {

    await ctx.render('admin/focus/add')
})


//   'pic'  和前端页面input  name 对应  (<input type="file"  name='pic' placeholder="")
router.post('/doAdd', tools.multer().single('pic'), async (ctx) => {
    let { title, status, url, sort } = ctx.req.body
    let pic = ctx.req.file ? `/upload/${ctx.req.file.filename}` : '' 
    let add_time = new Date().toLocaleString()
    let json = {
        title, status, url, sort, add_time, pic
    }
    
    let result = await DB.insert('focus', json)
    if(result.result.ok) {
        ctx.redirect('/admin/focus')
    }


})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;

    let result = await DB.find('focus', { "_id": DB.getObjectId(id) });
    await ctx.render('admin/focus/edit', {
        data: result[0]
    })
})

// 编辑内容
router.post('/doEdit', tools.multer().single('pic'), async (ctx) => {
    let {id, title, status, url, sort} = ctx.req.body
    let pic = ctx.req.file ? `/upload/${ctx.req.file.filename}` : '' 
    let add_time = new Date().toLocaleString()
    let json = {
        title, status, url, sort
    }
    if (pic) {
        json.pic = pic
    }
    let result = await DB.update('focus', {"_id": DB.getObjectId(id)}, json)
    if(result.result.ok) {
        ctx.redirect('/admin/focus')
    }


})


module.exports = router.routes();