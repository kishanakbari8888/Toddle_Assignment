const router = require('express').Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');
const getCurrentDateTime = require('../extrafunction/dateTostandaedformate');
const teacherAuthorization = require('../authorization/authorization');
const student_teacherAuthorization = require('../authorization/authorization');


function standardformate(time){
    const now = new Date(time);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with leading zeros if needed
    const day = String(now.getDate()).padStart(2, '0');
  
    // Get the time components
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  

    const getCurrentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return getCurrentDateTime;
};

function getallpost(result,teacher=0){
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

                    // console.log(typeof(result[0].time));
                    // result[0].time conver into date standard formate

                    const time = result[0].time;
                    
                    if(standardformate(time) > getCurrentDateTime() && teacher!=1){
                        return resolve(0);
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
                        // console.log(temp);
                        post.push(temp);
                        return resolve(0);
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
                // console.log(err);
                return res.status(500).send('Server error');
            }
            post = await getallpost(result,1);
            return res.status(200).send(post);
        });
    }
    else{

        let post = [];
        
        await connection.query(`SELECT * FROM tag WHERE studentid = "${name}"`,async (err,result)=>{
            if(err){
                // console.log(err);
                return res.status(500).send('Server error');
            }

            post = await getallpost(result);
        
            return res.status(200).send(post);
        });

    }
});


module.exports = router;