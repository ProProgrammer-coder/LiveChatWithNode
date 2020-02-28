const express = require("express");
const mysql = require("mysql");
const io = require("socket.io")(4000);


const db = mysql.createConnection({
    host: "	rdbms.strato.de",
    user: "U3727967",
    password: "Unsere_erste_Homepage!",
    database: "DB3727967"
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Mysql connected");
});
const app = express();

function createHoleChats(params) {

    let sql = `SELECT transmittor,message,time FROM ${params}`;
    db.query(sql, (err, result) => {
        if (err) throw err;

        io.emit("response-server-send-created-chat", { result, params });
    })

}


function insertInDatabase(message) {
    data = {transmittor: message.name,message:message.message,time:message.time};
    const messageRoom = message.room.toLowerCase();
    let sql = `INSERT INTO ${messageRoom} SET ?`;
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
    })
}


io.on('connection', socket => {
    socket.emit("chat-message", "Hellof World");
    socket.on("send-to-room", message => {
        socket.broadcast.to(message.room).emit("sended", message.send);
    });
    socket.on("create-hole-chat", message => {
        createHoleChats(message);
        //socket.broadcast.to("Ibo").emit("sended","It work");
        return true;
    });
    socket.on("join-room", message => {
        socket.join(message);
        return true;
    });
    socket.on("send-massage-in-rooms", message => {
        insertInDatabase(message);
        socket.broadcast.to(message.room).emit("send-massage-in-room", {room:message.room, name: message.name, message: message.message, time: message.time });
    })

})








// Create connection




app.get("/", (req, res) => {
   res.send("Hello World");  
});

app.listen("3000",()=>{
    
});
