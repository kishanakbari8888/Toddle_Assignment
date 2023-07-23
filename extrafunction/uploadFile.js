const multer = require('multer');
const path = require('path');
const {connection} = require('../dataBaseconnection');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,__dirname+'/../uploads/');
    },
    filename:async function(req,file,cb){
        let postid = file.fieldname;

        await connection.query(`select * from post where postid = "${postid}"`,async (err,result)=>{
            if(err){
                // console.log(err);
                return cb(new Error('postid not found'));
            }

            if(result.length == 0){
                return cb({error:"postid not found"},null);
            }

            //change file name to postid in sql db
            await connection.query(`UPDATE post SET filename = "${postid}" WHERE postid = "${postid}"`,(err,result)=>{
                if(err){
                    return cb(new Error('postid not found'));
                }

                let fileExtension = path.extname(file.originalname);
                return cb(null,postid + fileExtension);
            });

        });

    }
});
const upload = multer({storage:storage});

exports.upload = upload;