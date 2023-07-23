const router = require('express').Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = require('../extrafunction/dateTostandaedformate');
const teacherAuthorization = require('../authorization/authorization');
const { upload } = require('../extrafunction/uploadFile');


router.post('/createjournal',teacherAuthorization ,async (req,res)=>{

    const {name} = req.user;
    
    let {description,studentids,published_at} =  req.body;

    
    if(published_at == undefined){
        published_at = getCurrentDateTime();
    }
    if(description == undefined){
        description = null;
    }
    if(studentids == undefined){
        studentids = [];
    }        
    const randomUUID = uuidv4();
    // console.log(randomUUID);

    await connection.query(`INSERT INTO post(postid,teacherid,description,filename,time) VALUES ("${randomUUID}","${name}","${description}","${null}","${published_at}")`,async (err,result)=>{
        if(err){
            return res.status(500).send('Server error');
        }
    });

    
    let error = {succfulyadded:[],notfound:[]};
    const allpromise = [];

    studentids.forEach(async (element) => {

        let promise = new Promise(async (resolve,reject)=>{
            await connection.query(`SELECT * FROM student WHERE userid = "${element}"`,async (err,result)=>{
                if(err){
                    return reject(err);
                }
                if(result.length == 0){
                    return resolve([0,element]);
                }

                await connection.query(`INSERT INTO tag(postid,studentid) VALUES ("${randomUUID}","${element}")`,async (err,result)=>{
                    if(err){
                        return reject(err);
                    }
                    return resolve([1,element]);
                });
            });
        });

        allpromise.push(promise);
    });
    
    try{
        await Promise.all(allpromise).then((data)=>{
            
            data.forEach((element)=>{
                if(element[0] == 1){
                    error.succfulyadded.push(element[1]);
                }
                else{
                    error.notfound.push(element[1]);
                }
            });
        });
    }
    catch(err){
        return res.status(500).send({error:"server error or some student already added"});
    }


    return res.status(200).json({postid:randomUUID,description,error,time:published_at});

});




router.post('/addfile',teacherAuthorization,(req,res)=>{

    upload.any()(req,res,(err)=>{
        if(err){
            return res.status(500).send(err);
        }
    
        return res.status(200).send({filestatus:"file uploaded"});
    })
});

router.post('/addstudent',teacherAuthorization,async (req,res)=>{
    
    const {postid,studentids} = req.body;
    // console.log(postid,studentids);
    
    let error = {succfulyadded:[],notfound:[]};
    const allpromise = [];

    studentids.forEach(async (element) => {

        let promise = new Promise(async (resolve,reject)=>{
            await connection.query(`SELECT * FROM student WHERE userid = "${element}"`,async (err,result)=>{
                if(err){
                    return reject(err);
                }
                if(result.length == 0){
                    return resolve([0,element]);
                }

                await connection.query(`INSERT INTO tag(postid,studentid) VALUES ("${postid}","${element}")`,async (err,result)=>{
                    if(err){
                        return reject(err);
                    }
                    return resolve([1,element]);
                });
            });
        });

        allpromise.push(promise);
    });
    
    try{
        await Promise.all(allpromise).then((data)=>{
            // console.log(data);
            data.forEach((element)=>{
                if(element[0] == 1){
                    error.succfulyadded.push(element[1]);
                }
                else{
                    error.notfound.push(element[1]);
                }
            });
        });
    }
    catch(err){
        return res.status(500).send({error:"server error or some student already added"});
    }

    // console.log(error);

    return res.status(200).json(error);
    
});




module.exports = router;