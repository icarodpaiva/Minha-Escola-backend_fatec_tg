import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteGroup } from "./delete"

export const groups = Router()

groups.post("/", create)
groups.get("/", find)
groups.get("/:id", findById)
groups.put("/:id", update)
groups.delete("/:id", deleteGroup)
