const router = require('express').Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = require('../extrafunction/dateTostandaedformate');
const teacherAuthorization = require('../authorization/authorization');
const { upload } = require('../extrafunction/uploadFile');
const fs = require('fs');
const path = require('path');


router.delete('/journal',teacherAuthorization,async (req,res)=>{
    const {postid} = req.body;

    await connection.query(`SELECT * FROM post WHERE postid = "${postid}" AND teacherid = "${req.user.name}"`,async (err,result)=>{
        if(err){
            return res.status(500).send('Server error');
        }
        if(result.length == 0){
            return res.status(400).send('You dont have this post');

        }

        await connection.query(`DELETE FROM post WHERE postid = "${postid}"`,async (err,result)=>{
            if(err){
                return res.status(500).send('Server error');
            }
            return res.status(200).send('Journal deleted');
        });
    });



});



router.delete('/removestudent',teacherAuthorization,async (req,res)=>{
        
        const {postid,studentids} = req.body;
        
        let error = {succfulydelect:[],notfound:[]};
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
                        if(result.length == 0){
                            return resolve([0,element]);
                        }
    
                    });
                    
                    await connection.query(`DELETE FROM tag WHERE postid = "${postid}" AND studentid = "${element}"`,async (err,result)=>{
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
            const result = await Promise.all(allpromise);
            result.forEach(element => {
                if(element[0] == 1){
                    error.succfulydelect.push(element[1]);
                }
                else if(element[0] == 0){
                    error.notfound.push(element[1]);
                }
            });
            return res.status(200).json(error);

        }
        catch(err){
            return res.status(500).send('Server error');
        }

});




router.delete('/deleteallfile',teacherAuthorization,async (req,res)=>{
   
    const filePath = __dirname + '/../uploads/' + req.body.postid + '.pdf'; 

    await connection.query(`UPDATE post SET filename = NULL WHERE postid = "${req.body.postid}"`,async (err,result)=>{
        if(err){
            return res.status(500).send('Server error');
        }
        
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).send('Server error');
                
            }
            return res.status(200).send('File Deleted');
        });

    });
    
});


// testing purpose
router.delete('/deletefile',async (req,res)=>{

    let filename = {deletefile:[]};
    const folderPath = '__dirname' + '/../uploads'; 
    fs.readdir(folderPath, (err, files) => {
        if (err) {
          return;
        }
      
        files.forEach((file) => {
          const filePath = path.join(folderPath, file);
      
            fs.unlink(filePath, (err) => {
                if (err) {
                    return;
                }
                
                filename.deletefile.push(file);
            });
        });
    });
    
    setTimeout(()=>{
        return res.json(filename);
    },5000);

});

module.exports = router;