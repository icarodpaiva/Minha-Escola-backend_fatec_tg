import { Router } from "express"

import { profile } from "./profile"
import { classes } from "./classes"
import { notifications } from "./notifications"

export const students = Router()

students.get("/profile", profile)
students.get("/classes", classes)
students.get("/notifications", notifications)
