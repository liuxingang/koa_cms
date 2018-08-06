/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-06 13:53:30
 */

var router = require('koa-router')();
var DB = require('../../model/db')

router.get('/', async (ctx) => {
    await ctx.render('admin/index')
})

// 公共方法--改变状态
router.get('/changeStatus', async (ctx) => {
    let { collectionName, attr, id } = ctx.query

    let result = await DB.find(collectionName, { '_id': DB.getObjectId(id) })
   
    if (result.length > 0) {
        if (result[0][attr] == 1) {
            var json = {
                [attr]: 0
            }
        } else {
            var json = {
                [attr]: 1
            }
        }

        let updateResult = await DB.update(collectionName,{'_id': DB.getObjectId(id)}, json)
        if (updateResult.result){
            ctx.body = { "message": "更新成功", "success": true }
        } else {
            ctx.body = { "message": "更新失败", "success": false }
        }

    } else {
        ctx.body = { "message": "更新失败", "success": false }
    }
    
})

// 公共方法--改变排序
router.get('/changeSort', async (ctx) => {
    let { collectionName, sortValue, id } = ctx.query
   
    let updateResult = await DB.update(collectionName,{'_id': DB.getObjectId(id)}, {sort: sortValue} )
        if (updateResult.result){
            ctx.body = { "message": "更新成功", "success": true }
        } else {
            ctx.body = { "message": "更新失败", "success": false }
        }

        
    
})

// 公共方法--删除数据
router.get('/delete', async (ctx) => {
    let ret_url = ctx.request.header.referer // 上一路由
    let { collectionName, id } = ctx.query

    let result = await DB.remove(collectionName, { '_id': DB.getObjectId(id) })
   
    if (result.result.ok) {
        ctx.redirect(ret_url)

    } else {
        ctx.body = { "message": "更新失败", "success": false }
    }
    
})


module.exports = router.routes();