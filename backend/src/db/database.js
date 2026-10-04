const {Pool} = require("pg")

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.PORT || 5432,
  database: process.env.DB_NAME || "taskmanager",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "5545"
})

module.exports = pool