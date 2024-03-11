import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteNotification } from "./delete"

export const notifications = Router()

notifications.post("/", create)
notifications.get("/", find)
notifications.get("/:id", findById)
notifications.put("/:id", update)
notifications.delete("/:id", deleteNotification)
