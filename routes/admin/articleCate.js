/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-02 18:57:26
 * 
 * 文章分类管理
 */

var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools');

router.get('/', async (ctx) => {
    let result = await DB.find('articleCate',{})
    result = tools.cateToList(result)
    await ctx.render('admin/articleCate/list',{
        list: result
    })
})

router.get('/add', async (ctx) => {
    let result = await DB.find('articleCate',{})
    result = tools.cateToList(result)
    await ctx.render('admin/articleCate/add', {
        cateList: result
    })
})

router.post('/doAdd', async (ctx) => {
    let {title, description, keywords, pid, status } = ctx.request.body
    let add_time = new Date().toLocaleString()
    if(!title){
        await ctx.render('admin/error', {
            message: '分类名称不能为空',
            redirect: '/admin/articleCate/add'
        })
        return
    }

    let findResult = await DB.find('articleCate', {title})
    if (findResult.length > 0) {
        await ctx.render('admin/error', {
            message: '分类名称已存在',
            redirect: '/admin/articleCate/add'
        })
        return
    }

    let result = await DB.insert('articleCate', {title, description, keywords, pid, add_time, status})
    if(result.result.ok){
         ctx.redirect('/admin/articleCate')
    } else {
        await ctx.render('admin/error', {
            message: '分类名称已存在',
            redirect: '/admin/articleCate/add'
        })
    }

   
})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id

    let cateList = await DB.find('articleCate',{})
    cateList = tools.cateToList(cateList)

    let result = await DB.find('articleCate',{"_id": DB.getObjectId(id)})
    await ctx.render('admin/articleCate/edit', {
        data: result[0],
        cateList: cateList
    })
})

router.post('/doEdit', async (ctx) => {
    let {id,title, description, keywords, pid, status } = ctx.request.body
    let add_time = new Date().toLocaleString()
    if(!title){
        await ctx.render('admin/error', {
            message: '分类名称不能为空',
            redirect: '/admin/articleCate/add'
        })
        return
    }

    let findResult = await DB.find('articleCate', {title})

    let result = await DB.update('articleCate',{'_id': DB.getObjectId(id)}, {title, description, keywords, pid,status, add_time})
    if(result.result.ok){
         ctx.redirect('/admin/articleCate')
    } else {
        await ctx.render('admin/error', {
            message: '分类名称已存在',
            redirect: `/admin/articleCate/edit?id${id}`
        })
    }

   
})


module.exports = router.routes();