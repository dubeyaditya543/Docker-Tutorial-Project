const express = require("express")
const cors = require("cors")
const PORT = 3000

const app = express()

app.use(cors())
app.use(express.json())

const tasks = [
  {
    id: 1,
    title: "Learn Docker",
    completed: false,
  },
  {
    id: 2,
    title: "Build a Docker project",
    completed: false,
  },
];

app.get("/api/health", (req, res) => {
  res.json({status: "ok", message: "Backed is operational"})
})

app.get("/api/tasks", (req, res) => {
  res.json(tasks)
})

app.post("/api/tasks", (req, res) => {
  const {title} = req.body

  if(!title || title.trim() === ""){
    return res.json({status: "failed", message: "Task title is required"})
  }

  const task = {
    id: Date.now() + Math.floor(Math.random() * 10),
    title: title.trim(),
    completed: false
  }

  tasks.push(task)

  res.status(201).json(task)
})

app.patch("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id)

  const task = tasks.find((t) => t.id === id)

  if(!task){
    return res.status(404).json({message: "Task not found"})
  }

  task.completed = !task.completed

  res.json(task)
})

app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id)

  const taskInd = tasks.findIndex((t) => t.id === id)

  if(taskInd === -1){
    return res.status(404).json({message: "Task not found"})
  }

  const deletedTasks = tasks.splice(taskInd, 1)

  return res.json(deletedTasks[0])
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})