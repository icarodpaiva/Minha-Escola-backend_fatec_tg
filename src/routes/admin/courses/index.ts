import { Router } from "express"

import { create } from "./create"
import { findAll } from "./findAll"
import { findById } from "./findById"
import { update } from "./updateById"
import { deleteById } from "./deleteById"

export const courses = Router()

courses.post("/", create)
courses.get("/", findAll)
courses.get("/:id", findById)
courses.put("/:id", update)
courses.delete("/:id", deleteById)
