import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteClass } from "./delete"

export const classes = Router()

classes.post("/", create)
classes.get("/", find)
classes.get("/:id", findById)
classes.put("/:id", update)
classes.delete("/:id", deleteClass)
