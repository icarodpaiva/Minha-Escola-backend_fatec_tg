import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteStaff } from "./delete"

export const staff = Router()

staff.post("/", create)
staff.get("/", find)
staff.get("/:id", findById)
staff.put("/:id", update)
staff.delete("/:id", deleteStaff)
