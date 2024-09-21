require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const User = require("./model/userModel")
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080

mongoose.connect("mongodb://127.0.0.1:27017/chatappdb")
.then((e)=>console.log("connected to server"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.static(path.resolve("./public")));
app.use('/',userRoutes);

// socket io
const http = require("http").Server(app);   //creates an HTTP server and passes your Express app (app) to it. By doing this, you’re telling the HTTP server to use your Express app to handle incoming requests.
const io = require("socket.io")(http);      //This binds socket.io to the HTTP server you created, enabling WebSocket support on your server

var userNamespace = io.of('/user-namespace');

userNamespace.on("connection",async (socket)=>{

    console.log("user connected");
    // console.log(socket.handshake.auth.token)
    var senderId = socket.handshake.auth.token;
    await User.findOneAndUpdate({_id:senderId},{$set:{isOnline:'1'}}) // to 1 -> online
    
    //broadcasting all user expcept current about online status of current user
    socket.broadcast.emit("UpdateOnlineStatus",{cu_id : senderId})

    socket.on("disconnect",async()=>{
        console.log("user disconnected")
        await User.findOneAndUpdate({_id:senderId},{$set:{isOnline:'0'}}) // to 0 -> offline

        socket.broadcast.emit("UpdateOfflineStatus",{cu_id : senderId})
    })
})

//start the HTTP server that wraps around your Express app. This allows socket.io to properly handle WebSocket connections.
http.listen(PORT,()=>console.log(`server started at ${PORT}`));