const express = require("express")
const PORT = 3000

const app = express()

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({status: "ok", message: "Backed is operational"})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})