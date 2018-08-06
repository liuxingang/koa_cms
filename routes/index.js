/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:09:43 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-07-31 09:22:08
 */


 var router = require('koa-router')();

 router.get('/', async (ctx) => {
     ctx.body = '前台首页'
 })
 router.get('/news', async (ctx) => {
    ctx.body = '新闻首页'
})

 module.exports = router.routes();