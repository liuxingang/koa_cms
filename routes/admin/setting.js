/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:24:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-06 17:26:07
 */
var config = require('../../model/config')
var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools')


router.get('/', async (ctx) => {
   

    let result = await DB.find('setting', {});

    await ctx.render('admin/setting/index', {
        data: result[0]
    })
})


// 编辑内容
router.post('/doEdit', tools.multer().single('site_logo'), async (ctx) => {
    let {id, site_title, site_keywords, site_description, site_icp} = ctx.req.body
    let site_logo = ctx.req.file ? `/upload/${ctx.req.file.filename}` : '' 
    let add_time = new Date().toLocaleString()
    let json = {
        site_title, site_keywords, site_description, site_icp
    }
    if (site_logo) {
        json.site_logo = site_logo
    }
    let result = await DB.update('setting',{}, json)
    if(result.result.ok) {
        ctx.redirect('/admin/setting')
    }


})


module.exports = router.routes();