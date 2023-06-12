const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT;
// const port = process.env.PORT || 3000

const users = [{}];

app.use(cors());
app.get("/", (req, res) => {
    res.send("its working");
})

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
    console.log("new connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined', { user: "Admin", message: ` ${users[socket.id]} has joined` });
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat,${users[socket.id]} ` })
        // console.log(users);
        list1 = []
        list2 = []
        for (const [key, value] of Object.entries(users)) {
            if (key !== '0') {
                list1.push(key);
                list2.push(value);
            }
        }
        console.log(list1)
        console.log(list2)
        io.emit('addOnline', list2)
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id });
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]}  has left` });
        console.log(`${users[socket.id]} left`);
        delete users[socket.id];
        // console.log(users);
        list1 = []
        list2 = []
        for (const [key, value] of Object.entries(users)) {
            if (key !== '0') {
                list1.push(key);
                list2.push(value);
            }
        }
        console.log(list1)
        console.log(list2)
        io.emit('removeOnline', list2)
    })
})

server.listen(port, () => {
    console.log(`connected to server with port http://localhost:${port}`);
})