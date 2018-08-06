/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:23:19 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-07-31 20:17:24
 */

const router = require('koa-router')();
const tools = require('../../model/tools');
const DB = require('../../model/db')
const svgCaptcha = require('svg-captcha');

router.get('/', async (ctx) => {
    if(ctx.session.userinfo){
        await ctx.redirect('/admin')
        return;
    }
    await ctx.render('admin/login')
})

// 登录接口
router.post('/doLogin', async (ctx) => {
    console.log(ctx.request.body)
    let { username, password, captcha } = ctx.request.body
    password = tools.md5(password)

    // 1、验证合法性
    if (captcha.toLocaleLowerCase() == ctx.session.captcha.toLocaleLowerCase()) {
        // 2、数据库匹配
        let result = await DB.find('admin', { "username": username, "password": password })
        if (result.length > 0) {
            console.log('成功')
            ctx.session.userinfo = result[0];

            // 记录登录时间 通过toLocaleString 转时区
            await DB.update('admin', {'_id': DB.getObjectId(result[0]._id)},{
                'last_time': new Date().toLocaleString()
            })

            await ctx.redirect('/admin')
        } else {
            await ctx.render('admin/error', {
                message: '用户名或者密码错误',
                redirect: ctx.state.__HOST__ + '/admin/login'
            })
        }
    } else {
        await ctx.render('admin/error', {
            message: '验证码错误',
            redirect: ctx.state.__HOST__ + '/admin/login'
        })
    }



})

// 验证码生成
router.get('/captcha', async (ctx) => {
    var captcha = svgCaptcha.create({
        size: 4,
        fontSize: 40,
        width: 120,
        height: 34,
        noise: 2,
        background: '#cc9966'
    });

    // 保存生成的验证码
    ctx.session.captcha = captcha.text

    console.log('------当前验证码------')
    console.log(ctx.session)

    ctx.type = 'image/svg+xml'
    ctx.body = captcha.data
})

// 退出功能
router.get('/loginOut', async (ctx) => {
    ctx.session.userinfo = null
    ctx.redirect('/admin/login')
})

module.exports = router.routes();