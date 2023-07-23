const router = require('express').Router();
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {connection} = require('../dataBaseconnection');
const tokentime = 60*60*24*3;


router.post('/registration',async (req,res)=>{
    
    const {name,password,userType} = req.body;
    // console.log(name,password);

    
    if(userType === 'student'){    
        
        await connection.query(`SELECT * FROM student WHERE userid = "${name}"`,async (err,result)=>{
            if(err){
                // console.log(err);
                return res.status(500).send('Server error');
            }
            if(result.length > 0){
                return res.status(400).send('User already exists');
            }

            const hashpass = bycrypt.hashSync(password,10);
            await connection.query(`INSERT INTO student (userid,password) VALUES ("${name}","${hashpass}")`,async (err,result)=>{
                if(err){
                    // console.log(err);
                    return res.status(500).send('Server error');
                }
                const token = jwt.sign({name:name,userType:userType},process.env.JWT_SECRET, { expiresIn: tokentime });
                
                return res.cookie('Jwt',token).send(token);
            
            });

        });

    }
    else if(userType === 'teacher'){
        await connection.query(`SELECT * FROM teacher WHERE userid = "${name}"`,async (err,result)=>{
            if(err){
                // console.log(err);
                return res.status(500).send('Server error');
            }
            if(result.length > 0){
                return res.status(400).send('User already exists');
            }

            const hashpass = bycrypt.hashSync(password,10);
            await connection.query(`INSERT INTO teacher (userid,password) VALUES ("${name}","${hashpass}")`,async (err,result)=>{
                if(err){
                    // console.log(err);
                    return res.status(500).send('Server error');
                }
                // console.log(1);
                const token = await jwt.sign({name:name,userType:userType},process.env.JWT_SECRET, { expiresIn: tokentime });
                // console.log(2);
                return res.cookie('Jwt',token).send(token);
            
            });

        });
        
    }
    else{
        res.status(400).send('Invalid userType');
    }
});

router.post('/login',async (req,res)=>{

    const {name,password,userType} = req.body;
    // console.log(name,password);

    
    if(userType === 'student'){    
        
        await connection.query(`SELECT * FROM student WHERE userid = "${name}"`,async (err,result)=>{
            if(err){
                // console.log(err);
                return res.status(500).send('Server error');
            }
            if(result.length == 0){
                return res.status(400).send('User does not exists');
            }
            const user = result[0];
            const validPass = await bycrypt.compare(password, user.password);
            if(!validPass){
                return res.status(400).send('Invalid password');
            }
            const token = jwt.sign({name:name,userType:userType},process.env.JWT_SECRET, { expiresIn: tokentime });
            return res.cookie('Jwt',token).send(token);
        });
          

    }
    else if(userType === 'teacher'){
        await connection.query(`SELECT * FROM teacher WHERE userid = "${name}"`,async (err,result)=>{
            if(err){
                // console.log(err);
                return res.status(500).send('Server error');
            }
            if(result.length == 0){
                return res.status(400).send('User does not exists');
            }
            const user = result[0];
            const validPass = await bycrypt.compare(password, user.password);
            if(!validPass){
                return res.status(400).send('Invalid password');
            }
            
            const token = jwt.sign({name:name,userType:userType},process.env.JWT_SECRET, { expiresIn: tokentime });
            return res.cookie('Jwt',token).send(token);
        });
    }
    else{
        res.status(400).send('Invalid userType');
    }



});




module.exports = router;