const express = require('express');
const mysql = require('mysql');
const common = require('../libs/common');
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'schema'
});
module.exports = () => {
    const route = express.Router();
    
    route.post('/login', (req, res) => {
        
        let username = req.body.username;
        let password = req.body.password;
        //let password = common.md5(mObj.loginPawd + common.MD5_SUFFXIE);
        // console.log(username, mObj.passwd);
        const selectUser = `SELECT * FROM t_user where username='${username}' and password='${password}'`;
        db.query(selectUser, (err, data) => {
            if (err) {
                console.log(err);
                res.send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                if (data.length == 0) {
                    res.send({ 'msg': '该用户不存在', 'status': -1 }).end();
                } else {
                    let dataw = data[0];
                    //console.log(dataw,dataw.password,req.body.password);
                    //login sucess
                    if (dataw.password === req.body.password) {
                        console.log("ok");
                        //save the session 
                        req.session['user_id'] = dataw.id;
                        dataw.status = 10000;  //ok
                        dataw.password = null;
                        res.send(dataw).end();
                    } else {
                        res.send({ 'msg': '密码不正确', 'status': -2 }).end();
                    }
                }
            }
        });

    });
    route.get('/music', (req, res) => {
        let pageNo = parseInt(req.query.pageNo);
        let pageSize = parseInt(req.query.pageSize);
        curPage = pageNo * pageSize;
        const getMusic = `SELECT * FROM t_song ORDER BY id LIMIT ${curPage}, ${pageSize} `;
        const getMusicCount = `SELECT count(*) as num FROM t_song`;
        let result = {};
        db.query(getMusic, (err, data) => {
            if (err) {
                res.status(500).send('database err').end();
            } else {
                if (data.length == 0) {
                    res.status(500).send('no datas').end();
                } else {
                    //console.log(data)
                    result.data = data;
                    result.pageNo = pageNo;
                    result.pageSize = pageSize;
                    db.query(getMusicCount, (err, data2) => {
                        if (err) {
                            res.status(500).send('database err').end();
                        } else {
                            if (data2.length == 0) {
                                res.status(500).send('no datas').end();
                            } else {
                                // console.log(data2[0].num)
                                result.totalRecord = data2[0].num;
                                //总页数  向上取整
                                result.totalPage = Math.ceil(data2[0].num/pageSize);
                                res.send(result).end();
                            }
                        }
                    });
                }
            }
        });
    });
    route.get('/tasks', (req, res) => {
        const getTasks = `SELECT * FROM t_task `;
        db.query(getTasks, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send('database err').end();
            } else {
                if (data.length == 0) {
                    res.status(500).send('no datas').end();
                } else {
                    //console.log(data)
                    res.send(data).end();
                }
            }
        });
    });
    route.post('/task/add', (req, res) => {
        
        let text = req.body.text;
        //let password = common.md5(mObj.loginPawd + common.MD5_SUFFXIE);
        // console.log(username, mObj.passwd);
        const insertTask = `INSERT INTO t_task(text) VALUES('${text}')`;
        db.query(insertTask, (err, data) => {
            if (err) {
                console.log(err);
                res.send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                res.send({ 'msg': '操作成功', 'status': 1 }).end();
            }
        });

    });
    route.post('/task/del', (req, res) => {
        
        let id = req.body.id;
        //let password = common.md5(mObj.loginPawd + common.MD5_SUFFXIE);
        // console.log(username, mObj.passwd);
        const delTask = `DELETE from t_task where id=${id}`;
        db.query(delTask, (err, data) => {
            if (err) {
                console.log(err);
                res.send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                res.send({ 'msg': '操作成功', 'status': 1 }).end();
            }
        });

    });
    route.post('/task/upd', (req, res) => {
        
        let id = req.body.id;
        let text = req.body.text;
        let completed = req.body.completed ? 'N' : 'Y';
        //let password = common.md5(mObj.loginPawd + common.MD5_SUFFXIE);
        // console.log(username, mObj.passwd);
        const updateTask = `update t_task set completed='${completed}', text='${text}' where id=${id}`;
        db.query(updateTask, (err, data) => {
            if (err) {
                console.log(err);
                res.send({ 'msg': '服务器出错', 'status': 0 }).end();
            } else {
                res.send({ 'msg': '操作成功', 'status': 1 }).end();
            }
        });

    });
    return route;
}
