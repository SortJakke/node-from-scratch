// import { createServer } from "node:http"
// const server = createServer((request, response) => {
//   response.write("test4")
//   return response.end()
// })
// server.listen(3333)

import { fastify } from "fastify"
// import { DatabaseMemory } from "./database-memory.js"
import { DatabasePostgres } from "./database-postgres.js"

const server = fastify()
// const database = new DatabaseMemory()
const database = new DatabasePostgres()

// GET, POST, PUT, DELETE, PATCH, ...

// POST to crate a video (http://localhost:3333/videos)
server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body

  await database.create({
    title,
    description,
    duration,
  })

  // console.log(database.list())
  return reply.status(201).send()
})

// GET to request a video (http://localhost:3333/videos)
server.get("/videos", async (request, reply) => {
  const search = request.query.search

  // console.log(search)

  const videos = await database.list(search)

  return videos
})

// PUT to edit a video (http://localhost:3333/videos/:id)
// Route Parameter :id
server.put("/videos/:id", async (request, reply) => {
  const videoId = request.params.id
  const { title, description, duration } = request.body

  await database.update(videoId, {
    title,
    description,
    duration,
  })

  return reply.status(204).send()
  // status 204: sucess and null
})

// DELETE to remove a video (http://localhost:3333/videos/:id)
server.delete("/videos/:id", async (request, reply) => {
  const videoId = request.params.id

  await database.delete(videoId)

  return reply.status(204).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
})
