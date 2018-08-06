var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Config = require('./config');

class Db {
    static getInstance() {
        if (!Db.instance) {  /* 单例  解决：多次实例化 实例无共享*/
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor() {
        this.dbClient = ''; /* 存放db 对象 */
        this.connect()
    }

    // 连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            // 解决数据库多次连接问题
            if (!this.dbClient) {
                MongoClient.connect(Config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.dbClient = client.db(Config.dbName);
                        resolve(this.dbClient)
                    }
                })
            } else {
                resolve(this.dbClient)
            }

        })
    }

    /* 
     根据参数个数 返回不同的查询数据
     DB.find('user',{}) 返回所有数据

     DB.find('user',{},{"title":1}) 返回所有数据 只有title 这一列

     分页查询
     DB.find('user',{},{},{
         page:2,
         pageSize: 20
     }) 返回第2页 20条数据所有内容
    
    */
    find(collectionName, json1, json2, json3 ) {

        if(arguments.length ==2){
            var attr = json2
            var slipNum = 0
            var pageSize = 0
        }else if(arguments.length ==3){
            var attr = json2
            var slipNum = 0
            var pageSize = 0
        }else if(arguments.length == 4){
            var attr = json2
            var page = json3.page || 1
            var pageSize = Number(json3.pageSize)
            var slipNum = (page - 1) * pageSize

            //新增排序查询
            if(json3.sortJson){
                var sortJson = json3.sortJson;
            }else{
                var sortJson = {}
            }
        }else{
            console.log('参数错误')
        }
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                // var result = db.collection(collectionName).find(json)
                var result = db.collection(collectionName).find(json1,{fields:attr}).skip(slipNum).limit(pageSize).sort(sortJson)
                result.toArray((err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    update(collectionName, json1, json2) {
        return new Promise((resolve,reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(json1,{$set: json2}, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                        return;
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                        return;
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    // 统计数量
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).count(json, (err, result) => {
                    if (err) {
                        reject(err)
                        return;
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    getObjectId(id) {  /* mongodb 里面查询 _id 把字符串转对象  */
        return new ObjectID(id);
    }
}

module.exports = Db.getInstance()
