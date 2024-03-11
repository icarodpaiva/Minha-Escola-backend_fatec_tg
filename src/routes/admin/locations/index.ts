import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteLocation } from "./delete"

export const locations = Router()

locations.post("/", create)
locations.get("/", find)
locations.get("/:id", findById)
locations.put("/:id", update)
locations.delete("/:id", deleteLocation)
