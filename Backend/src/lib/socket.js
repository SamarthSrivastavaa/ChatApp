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

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id); //An unique identifier for the session.

    //listening for disconnect now
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
    })
})

export {io,app,server}

//now remove the NORMAL express app created in express.js n al..import it there and remove(i commented out the normal creation)
//do server.listen instd of app.listen