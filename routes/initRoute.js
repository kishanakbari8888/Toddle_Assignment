const { request } = require('express');

const router = require('express').Router();

router.get('/',(req,res)=>{
    res.json({
        message: 'Hello this is Kishan Akbari backend for toddle assignment',
        api: {
            Homepage: "https://toddle-assignment.onrender.com",
            Authentification: {
                register: '/api/user/registration',
                login: '/api/user/login',
            },
            journal: {
                methodType: 'post',
                createjournal: '/api/journal/createjournal',
                addfile: '/api/journal/addfile',
                addstudent: '/api/journal/addstudent'
            },
            updatejournal: {
                // put request
                methodType: 'put',
                uploaddescription: '/api/journal/update/description',
                addstudent: '/api/journal/update/addstudent',
                updateFile: 'api/journal/update/updatefile'
            },
            removejournal : {
                // delete request
                methodType: 'delete',
                deletejournal : 'api/journal/delete/journal',
                removestudent: 'api/journal/delete/removestudent',
                deletefile:'api/journal/delete/deleteallfile'

            },
            Feed: {
                // post request
                methodType: 'post',
                getjournal: '/api/feed/getjournal',
                getjournalByFilter: '/api/feed/journalfilter',
            },
        },
        Info: {
            TechStack: {
                language: "javascript",
                runtimeEnv: "Node.js",
                framework: "Express",
                database: "Mysql"

            }
        }

    });

});

module.exports = router;