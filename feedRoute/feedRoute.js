const router = require('express').Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');
const getCurrentDateTime = require('../extrafunction/dateTostandaedformate');
const teacherAuthorization = require('../authorization/authorization');
const student_teacherAuthorization = require('../authorization/authorization');



function getallpost(result){
    let post = [];
    return new Promise(async (resolve,reject)=>{
        let allpromise = [];
        result.forEach(async (element) => {
            let promise = new Promise(async (resolve,reject)=>{
                let temp = {};
                
                await connection.query(`SELECT * FROM post WHERE postid = "${element.postid}"`,async (err,result)=>{
                    if(err){
                        reject(err);
                    }

                    if(result[0].time > getCurrentDateTime){
                        resolve();
                    }

                    temp.teacherid = result[0].teacherid;
                    temp.description = result[0].description;
                    temp.filename = result[0].filename;
                    temp.time = result[0].time;
                    

                    await connection.query(`SELECT studentid FROM tag WHERE postid = "${element.postid}"`,async (err,result1)=>{
                        if(err){
                            reject(err);
                        }
                        
                        result1 = result1.map((element)=>{
                            return element.studentid;
                        });
                        temp.student = result1;
                        console.log(temp);
                        post.push(temp);
                        resolve();
                    });
                
                });


            });
            allpromise.push(promise);
        });
        await Promise.all(allpromise);
        resolve(post);
    });

}


router.post('/getjournal',student_teacherAuthorization,async (req,res)=>{
    
    const {name} = req.user;
    let post = [];
    if(req.user.userType == 'teacher'){
        
        await connection.query(`SELECT * FROM post WHERE teacherid = "${name}"`,async (err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Server error');
            }
            post = await getallpost(result);
            return res.status(200).send(post);
        });
    }
    else{

        let post = [];
        
        await connection.query(`SELECT * FROM tag WHERE studentid = "${name}"`,async (err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Server error');
            }

            post = await getallpost(result);
        
            return res.status(200).send(post);
        });

    }
});


module.exports = router;