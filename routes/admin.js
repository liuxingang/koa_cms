/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:09:43 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-06 17:00:05
 */

var config = require('../model/config')
var router = require('koa-router')();
var ueditor = require('koa2-ueditor')
var index = require('./admin/index');
var login = require('./admin/login');
var user = require('./admin/user');
var manage = require('./admin/manage');
var articleCate = require('./admin/articleCate');
var article = require('./admin/article');
var focus = require('./admin/focus');
var link = require('./admin/link');
var setting = require('./admin/setting');



router.use(async (ctx, next) => {
    // console.log('---------当前session ------')
    // console.log(ctx.session)
    //模板引擎配置全局的变量
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;

    let path = ctx.request.path
    let splitUrl = path.substring(1).split('/')
    // console.log('-------admin页面router 控制------')

    // 配置全局信息
    ctx.state.G = {
        activeUrl: splitUrl,
        userinfo: ctx.session.userinfo
    }

    // 后台权限判断
    if (ctx.session.userinfo) {
        await next();
    } else {
        if (path == '/admin/login' || path == '/admin/login/doLogin' || path == '/admin/login/captcha') {
            await next();
        } else {
            ctx.redirect('/admin/login')
        }

    }
})

// 需要传一个数组：静态目录和 UEditor 配置对象
    // 比如要修改上传图片的类型、保存路径
    router.all('/editorUpload', ueditor([config.uploadUeditorPath, {
        "imageAllowFiles": [".png", ".jpg", ".jpeg"],
	    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
    }]))



router.use(index)
router.use('/login', login)
router.use('/manage', manage)
router.use('/user', user)
router.use('/articleCate', articleCate)
router.use('/article', article)
router.use('/focus', focus)
router.use('/link', link)
router.use('/setting', setting)

module.exports = router.routes();