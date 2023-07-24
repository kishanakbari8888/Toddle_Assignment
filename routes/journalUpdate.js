const router = require('express').Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = require('../extrafunction/dateTostandaedformate');
const teacherAuthorization = require('../authorization/authorization');
const { upload } = require('../extrafunction/uploadFile');

router.put('/description',teacherAuthorization,async (req,res)=>{
    const {postid,description} = req.body;
    await connection.query(`SELECT * FROM post WHERE postid = "${postid}" AND teacherid = "${req.user.name}"`,async (err,result)=>{
        if(err){
            return res.status(500).send('Server error');
        }
        if(result.length == 0){
            return res.status(400).send('You dont have this post');   
        }
        
        await connection.query(`UPDATE post SET description = "${description}" WHERE postid = "${postid}"`,async (err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Server error');
            }
            return res.status(200).send('description updated');
        });
        
    });
});

router.put('/addstudent',teacherAuthorization,async (req,res)=>{
    
    const {postid,studentids} = req.body;

    await connection.query(`SELECT * FROM post WHERE postid = "${postid}" AND teacherid = "${req.user.name}"`,async (err,result)=>{
        if(err){
            return res.status(500).send('Server error');
        }
        if(result.length == 0){
            return res.status(400).send('You dont have this post');

        }
        
        let error = {succfulyadded:[],alreadyindb:[],notfound:[]};
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

                    await connection.query(`SELECT * FROM tag WHERE postid = "${postid}" AND studentid = "${element}"`,async (err,result)=>{
                        if(err){
                            return reject(err);
                        }
                        if(result.length != 0){
                            return resolve([2,element]);
                        }

                    });



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
                    else if(element[0] == 2){
                        error.alreadyindb.push(element[1]);
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
        
        return res.status(200).json(error);
    });
    
});



router.post('/updatefile',teacherAuthorization,(req,res)=>{

    // check postid and user is valid or not
    const {postid} = req.body;
    connection.query(`SELECT * FROM post WHERE postid = "${postid}" AND teacherid = "${req.user.name}"`,async (err,result)=>{
        if(err){
            return res.status(500).send('Server error');
        }
        if(result.length == 0){
            return res.status(400).send('You dont have this post');

        }
        
        upload.any()(req,res,(err)=>{
            if(err){
                return res.status(500).send(err);
            }
        
            return res.status(200).send({filestatus:"file uploaded"});
        })
    });

});









module.exports = router;