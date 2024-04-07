import { Router } from "express"

import { profile } from "./profile"
import { classes } from "./classes"
import { groups } from "./groups"
import { notifications } from "./notifications"

import { updateClassDetails } from "./updateClassDetails"

export const app = Router()

app.get("/profile", profile)
app.get("/classes", classes)
app.get("/groups", groups)
app.get("/notifications", notifications)

app.patch("/classes/:id/details", updateClassDetails)
