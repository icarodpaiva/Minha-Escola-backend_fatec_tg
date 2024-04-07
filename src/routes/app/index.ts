import { Router } from "express"

import { profile } from "./profile"
import { classes } from "./classes"
import { groups } from "./groups"
import { notifications } from "./notifications"

import { updateClassDetails } from "./updateClassDetails"
import { createNotification } from "./createNotification"

import { sendNotification } from "../../middlewares/sendNotification"

export const app = Router()

app.get("/profile", profile)
app.get("/classes", classes)
app.get("/groups", groups)
app.get("/notifications", notifications)

// Only to staffs
app.patch("/classes/:id/details", updateClassDetails)
app.post("/notifications", createNotification, sendNotification)
