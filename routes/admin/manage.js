/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-01 18:49:34
 */

var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools')

router.get('/', async (ctx) => {
    let result = await DB.find('admin', {});
    await ctx.render('admin/manage/list', {
        list: result
    })
})

router.get('/add', async (ctx) => {
    await ctx.render('admin/manage/add')
})

// 新增管理员
router.post('/doAdd', async (ctx) => {
   
    let { username, password, repassword } = ctx.request.body

    if (!/^\w{4,20}/.test(username)) {
        await ctx.render('admin/error', {
            message: '用户名不合法',
            redirect: '/admin/manage/add'
        })
        return
    }

    if (password.length < 6) {
        await ctx.render('admin/error', {
            message: '密码长度不能小于6位',
            redirect: '/admin/manage/add'
        })
        return
    }

    if (repassword != password) {
        await ctx.render('admin/error', {
            message: '两次密码输入不一致',
            redirect: '/admin/manage/add'
        })
        return
    }

    // 查询数据库 食肉已经存在
    let result = await DB.find('admin', { 'username': username });
    if (result.length > 0) {
        await ctx.render('admin/error', {
            message: '用户名已存在',
            redirect: '/admin/manage/add'
        })
        return
    } else {
        let addResult = await DB.insert('admin', { 'username': username, 'password': tools.md5(password), 'status': 1, 'last_time': '' });
        if (addResult.result.ok) {
            await ctx.redirect('/admin/manage')
        }else {
            await ctx.render('admin/error', {
                message: '未知错误',
                redirect: '/admin/manage/add'
            })
        }
    }


})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('admin', {"_id": DB.getObjectId(id)});
    await ctx.render('admin/manage/edit',{
        data: result[0]
    })
})
// 修改用户
router.post('/doEdit', async (ctx) => {
    console.log(ctx.request.body)
    let {id, username, password, repassword} = ctx.request.body

    if(!password.length) {
        await ctx.redirect('/admin/manage')
    }
    if (password.length < 6) {
        await ctx.render('admin/error', {
            message: '密码长度不能小于6位',
            redirect: `/admin/manage/edit?id=${id}`
        })
        return
    }

    if (repassword != password) {
        await ctx.render('admin/error', {
            message: '两次密码输入不一致',
            redirect: `/admin/manage/edit?id=${id}`
        })
        return
    }

    // 更新密码
    let result = await DB.update('admin', {"_id": DB.getObjectId(id)},{"password": tools.md5(password)});
    if(result.result.ok){
        await ctx.redirect('/admin/manage')
    }else{
        await ctx.render('admin/error', {
            message: '修改失败',
            redirect: `/admin/manage/edit?id=${id}`
        })
    }
    
})


module.exports = router.routes();