import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteGroup } from "./delete"

import { findGroupNotifications } from "./findGroupNotifications"
import { findGroupStudents } from "./findGroupStudents"
import { updateGroupStudents } from "./updateGroupStudents"

export const groups = Router()

groups.post("/", create)
groups.get("/", find)
groups.get("/:id", findById)
groups.put("/:id", update)
groups.delete("/:id", deleteGroup)

groups.get("/:id/notifications", findGroupNotifications)
groups.get("/:id/students", findGroupStudents)
groups.put("/:id/students", updateGroupStudents)
