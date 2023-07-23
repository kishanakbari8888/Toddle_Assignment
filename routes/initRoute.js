const router = require('express').Router();

router.get('/',(req,res)=>{
    console.log("hello");
    res.send('home');
});

module.exports = router;