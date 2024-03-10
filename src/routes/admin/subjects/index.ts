import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteSubject } from "./delete"

export const subjects = Router()

subjects.post("/", create)
subjects.get("/", find)
subjects.get("/:id", findById)
subjects.put("/:id", update)
subjects.delete("/:id", deleteSubject)
