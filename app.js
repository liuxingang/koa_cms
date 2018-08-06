/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:28:37 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-03 17:17:43
 */
var config = require('./model/config')
var path = require('path');
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var static = require('koa-static');
var router = require('koa-router')();
var views = require('koa-views');
var render = require('koa-art-template');
var session = require('koa-session');

var app = new Koa();

// 配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'lkoa:xg', /** (string) cookie key (default is koa:sess) */
    maxAge: 1000 * 60 * 30,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

// 配置静态资源中间件
app.use(static(__dirname + '/public'))
// 为上传图片设置虚拟路径
app.use(static(path.join(config.uploadPath, '../')))
app.use(bodyParser());

// 配置路由
var index = require('./routes/index')
var api = require('./routes/api')
var admin = require('./routes/admin')
router.use('/admin', admin);
router.use('/api', api);
router.use(index);



app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
console.log('server is running 3000')
