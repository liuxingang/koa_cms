/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-07-30 17:12:53
 */

var router = require('koa-router')();

router.get('/', async (ctx) => {
    await ctx.render('admin/user/list')
})

router.get('/add', async (ctx) => {
    await ctx.render('admin/user/add')
})

router.get('/edit', async (ctx) => {
    ctx.body = '编辑用户'
})


module.exports = router.routes();