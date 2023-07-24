<div align="center">
  <h1>Backend API using Node js</h1>
</div>


## Table of Content

- [Introduction](#introduction)


## Introdution

- API is for Jounral management with 2 users:
  1. student
  2. teacher

- API's responds based on the user
- Tokens are generated using JWT library and stored in cookies
- Mysql used for database


## Installation

### Prerequisites

Before you start, ensure you have the following installed on your system:

- Node.js (v12 or higher)

### Install via npm

To install the library using npm, open your terminal and run the following command:

```bash
npm install
npm start
```

## Deployment domain link

- Link to homepage endpoint : https://toddle-assignment.onrender.com/api/user/registration

## API Endpoints

```json
{
    "message": "Hello this is Kishan Akbari backend for toddle assignment",
        "api": {
            "Homepage": "https://toddle-assignment.onrender.com",
            "Authentification": {
                "register": "/api/user/registration",
                "login": "/api/user/login"

            },
            "journal": {

                "methodType": "post",
                "createjournal": "/api/journal/createjournal",
                "addfile": "/api/journal/addfile",
                "addstudent": "/api/journal/addstudent"
            },
            "updatejournal": {

                "methodType": "put",
                "uploaddescription": "/api/journal/update/description",
                "addstudent": "/api/journal/update/addstudent",
                "updateFile": "api/journal/update/updatefile"

            },
            "removejournal" : {

                "methodType": "delete",
                "deletejournal" : "api/journal/delete/journal",
                "removestudent": "api/journal/delete/removestudent",
                "deletefile":"api/journal/delete/deleteallfile"

            },
            "Feed": {

                "methodType": "post",
                "getjournal": "/api/feed/getjournal",
                "getjournalByFilter": "/api/feed/journalfilter"
            },
        },
        "Info": {
            "TechStack": {
                "language": "javascript",
                "runtimeEnv": "Node.js",
                "framework": "Express",
                "database": "Mysql"

            }
        }
}
```

## Database Schema 

![image](https://github.com/kishanakbari8888/Toddle_Assignment/assets/88237282/1ffc565a-354e-4f2a-ae24-15f216ae1097)


## Notification design

![image](https://github.com/kishanakbari8888/Toddle_Assignment/assets/88237282/ac233353-a81a-4a12-bc3f-a6072a716546)


### Notification service

- Notification service is implemented using socket.io.
- Notification service is responsible for sending notification to all the users who are connected to the Journal, when a new journal is created, updated or deleted, checking if the client is available or not and sending notification to the client when the client is available.


### About Web-socket.io
- WebSocket is a bidirectional communication protocol that can send the data from the client to the server or from the server to the client by reusing the established connection channel. The connection is kept alive until terminated by either the client or the server
- All the frequently updated applications used WebSocket because it is faster than HTTP Connection. It is a full-duplex communication protocol that means the data can be sent and received simultaneously.

