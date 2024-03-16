import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteStudent } from "./delete"

export const students = Router()

students.post("/", create)
students.get("/", find)
students.get("/:id", findById)
// students.put("/:id", update)
// students.delete("/:id", deleteStudent)
