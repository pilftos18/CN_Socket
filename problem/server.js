// Complete the server.js file to make user's add, delete and update the todos.
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import  Task  from "./task.schema.js";
import { connectToDatabase } from "./db.config.js";
import { log } from 'console';

export const app = express();

app.use(cors());

export const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET',"POST"]
    }
});

io.on("connection",(socket)=>{
    console.log("Connection made.");
    Task.find()
    .then(tasks =>{
      
        socket.emit('tasks', tasks) 
    })
    .catch(err =>{
        console.error('Error Fetching tasks:', err)
    })

    //Event Handler for creating a new task
    socket.on("createTask",(task)=>{
        const newTask = new Task({ task });
        newTask.save()
        .then(savedTask =>{
            io.emit("newTask", savedTask);
        })
        .catch(err=>{
            console.error('Error creating task:', err)
        })
    })

      // Event handler for deleting a task
    socket.on("deleteTask",(taskId)=>{
        Task.findByIdAndRemove(taskId)
        .then(()=>{
            io.emit('taskDelete', taskId)
        })
        .catch((err)=>{
            console.error("Error Deleting task:", err)
        })
    })

    socket.on('updateTask',(taskId, newText)=>{

        Task.findByIdAndUpdate(
            taskId,
            {task : newText},
            {createdAt : new Date()  }
        )
        .then((updateTask)=>{

            // console.log(updateTask);
            io.emit("taskUpdated", updateTask);
        })
        .catch((err)=>{
                console.error("Error updating task:", err)
        })
    });

    // socket.on("sendtask",task=>{
    //     console.log('server',task);
    //  socket.broadcast.emit("broadcast",task);
    // })
    socket.on('disconnect',()=>{
        console.log("Connection disconnect");
        
    })
})

server.listen(3000, () => {
    console.log('Server is running on port 3000');
    connectToDatabase();
});

