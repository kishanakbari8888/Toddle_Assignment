
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');


const teacherAuthorization = async (req,res,next)=>{
    const token = req.cookies.Jwt;
    if(token){
        try{
            const verified = await jwt.verify(token,process.env.JWT_SECRET);
            req.user = verified;
            if(verified.userType != 'teacher'){
                return res.status(401).send('Access denied');
            }

            await connection.query(`SELECT * FROM teacher WHERE userid = "${verified.name}"` ,async (err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).send('Server error');
                }
                if(result.length == 0){
                    return res.status(400).send('User does not exists');
                }
                return next();
         
            });

        }
        catch(err){
            return res.status(400).send('Invalid token');
        }
    }
    else
        return res.status(401).send('Access denied');
    
}

const student_teacherAuthorization = async (req,res,next)=>{
    const token = req.cookies.Jwt;
    if(token){
        try{
            const verified = await jwt.verify(token,process.env.JWT_SECRET);
            req.user = verified;
            if(verified.userType != 'teacher' && verified.userType != 'student'){
                return res.status(401).send('Access denied');
            }

            if(verified.userType == 'student'){

                await connection.query(`SELECT * FROM student WHERE userid = "${verified.name}"` ,async (err,result)=>{
                    if(err){
                        console.log(err);
                        return res.status(500).send('Server error');
                    }
                    if(result.length == 0){
                        return res.status(400).send('User does not exists');
                    }
                    return next();
                });
            }
            else{
                await connection.query(`SELECT * FROM teacher WHERE userid = "${verified.name}"` ,async (err,result)=>{
                    if(err){
                        console.log(err);
                        return res.status(500).send('Server error');
                    }
                    if(result.length == 0){
                        return res.status(400).send('User does not exists');
                    }
                    return next();
                });
            }

        }
        catch(err){
            return res.status(400).send('Invalid token');
        }
    }
    else
        return res.status(401).send('Access denied');
}


module.exports = teacherAuthorization;
module.exports = student_teacherAuthorization;

