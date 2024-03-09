import { Router } from "express"

import { create } from "./create"
import { findAll } from "./findAll"
import { findByName } from "./findByName"
import { update } from "./updateById"
import { deleteById } from "./deleteById"

export const courses = Router()

courses.post("/", create)
courses.get("/", findAll)
courses.get("/:name", findByName)
courses.put("/:id", update)
courses.delete("/:id", deleteById)
