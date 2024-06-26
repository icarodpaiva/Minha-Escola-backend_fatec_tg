import "reflect-metadata"

import dotenv from "dotenv"
import express from "express"
import cors from "cors"

import { mainRoutes } from "../src/routes"

dotenv.config()

const server = express()

server.use(cors())
server.use(express.json())

server.use(mainRoutes)

server.use((_, res) => {
  res.status(404).send("Not found")
})

const PORT = process.env.PORT ?? 3000

server.listen(PORT, () =>
  console.log(`Server running in http://localhost:${PORT}`)
)
