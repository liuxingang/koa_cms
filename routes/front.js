/*
 * @Author: liuxingang 
 * @Date: 2018-07-30 16:09:43 
 * @Last Modified by: liuxingang
 * @Last Modified time: 2018-08-07 19:28:33
 */


var router = require('koa-router')();
var DB = require('../model/db')

router.use(async (ctx, next) => {


    let path = ctx.request.path
    
    let seoInfo = await DB.find('setting',{});
    // 配置全局信息
    
    ctx.state.pathname = path
    ctx.state.setting = seoInfo[0]
    await next();
})

/* 首页 */
router.get('/', async (ctx) => {
    // 轮播图
    let focusList = await DB.find('focus', { $or: [{ 'status': 1 }, { 'status': '1' }] }, {}, {
        sortJson: { 'sort': -1 }
    })

    await ctx.render('front/index', {
        focusList
    })
})

/* 公司服务 */
router.get('/service', async (ctx) => {
    // 公司服务 
    let serviceList = await DB.find('article', { 'pid': '5b690cbcf6810e4ca147fbdc' }, { title: 1, img_url: 1 })
    console.log(serviceList)
    await ctx.render('front/service', {
        serviceList
    })
})

/* 详情页 */
router.get('/content/:id', async (ctx) => {
    let id = ctx.params.id
    let result = await DB.find('article', { '_id': DB.getObjectId(id) })
    let catename = result[0].catename
    await ctx.render('front/content', {
        data: result[0]
    })
})

/* 成功案例 */
router.get('/case', async (ctx) => {
    // 获取成功案例分类
    let cateList = await DB.find('articleCate', { 'pid': '5b690c1cf6810e4ca147fbd9' })
    // 分类id
    let pid = ctx.query.pid;
    let page = ctx.query.page || 1;
    let pageSize = 6;
    let articleList, articleNum;
    if (pid) {
        articleList = await DB.find('article', { pid: pid }, {}, {
            page,
            pageSize
        });
        articleNum = await DB.count('article', { pid: pid });
    } else {
        // 循环子分类 获取子分类的内容
        let subCateArr = [];
        for (let i = 0; i < cateList.length; i++) {
            subCateArr.push(`${cateList[i]._id}`)
        }
        // 获取所有分类数据
        articleList = await DB.find('article', { pid: { $in: subCateArr } }, {}, {
            page,
            pageSize
        });
        articleNum = await DB.count('article', { pid: { $in: subCateArr } });
    }

    await ctx.render('front/case', {
        cateList,
        articleList,
        pid,
        page: page,
        totalPages: Math.ceil(articleNum / pageSize)
    })
})

/* 新闻资讯 */
router.get('/news', async (ctx) => {
    // 获取新闻分类
    let cateList = await DB.find('articleCate', { 'pid': '5b690bc1f6810e4ca147fbd6' })
    console.log(cateList)
    // 分类id
    let pid = ctx.query.pid;
    let page = ctx.query.page || 1;
    let pageSize = 6;
    let articleList, articleNum;
    if (pid) {
        articleList = await DB.find('article', { pid: pid }, {}, {
            page,
            pageSize
        });
        articleNum = await DB.count('article', { pid: pid });
    } else {
        // 循环子分类 获取子分类的内容
        let subCateArr = [];
        for (let i = 0; i < cateList.length; i++) {
            subCateArr.push(`${cateList[i]._id}`)
        }
        // 获取所有分类数据
        articleList = await DB.find('article', { pid: { $in: subCateArr } }, {}, {
            page,
            pageSize
        });
        articleNum = await DB.count('article', { pid: { $in: subCateArr } });
    }

    await ctx.render('front/news', {
        cateList,
        articleList,
        pid,
        page: page,
        totalPages: Math.ceil(articleNum / pageSize)
    })
})
router.get('/about', async (ctx) => {
    // 获取工厂图片
    let imgList = await DB.find('article', { 'pid': '5b62e3ab986d0cb36d0397b2' })
    // 获取公司简介
    let title = '公司简介'
    let result = await DB.find('article',{title:title})
    await ctx.render('front/about',{
        aboutData: result[0],
        imgList
    })
})
router.get('/connect', async (ctx) => {
    let title = '联系我们'
    let result = await DB.find('article',{title:title})
    await ctx.render('front/connect',{
        data: result[0]
    })
})


module.exports = router.routes();