/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:09:43 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-01 11:45:22
 */


 var router = require('koa-router')();

 router.get('/', async (ctx) => {
    //  ctx.body = {
    //      status: 200,
    //      success: true,
    //      data: {
    //          'username': 'admin'
    //      }
    //  }
     ctx.body = [1,2,3,4,45]
 })

router.get('/getDateByPrintNum', async (ctx) => {

    ctx.body = {
        name: '测试111',
        age: 7,
        car: '豫A7D8JDJ',
        mobile: '13333333333',
        book: 'book,dada,book'
    }
})

 module.exports = router.routes();