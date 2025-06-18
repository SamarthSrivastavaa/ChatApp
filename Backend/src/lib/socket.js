import {Server} from "socket.io"
import http from "http"
import express from "express"

const app=express()
const server=http.createServer(app)
 
const io=new Server(server,
    {
       cors:{
        origin:["http://localhost:5173"]
       }
    }
)

const userSocketMap={}  //userid:socketId
io.on("connection",(socket)=>{
    console.log("A user connected",socket.id); //An unique identifier for the session.
    const userId=socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id
    }
    //io.emit() is used to send events to all the connected clients/broadcasting it
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    //listening for disconnect now
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
         io.emit("getOnlineUsers",Object.keys(userSocketMap))
        console.log("A user disconnected",socket.id)
        
    })
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

export {io,app,server}

//now remove the NORMAL express app created in express.js n al..import it there and remove(i commented out the normal creation)
//do server.listen instd of app.listen