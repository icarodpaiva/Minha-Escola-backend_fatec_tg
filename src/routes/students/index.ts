import { Router } from "express"

import { profile } from "./profile"
import { classes } from "./classes"
import { topics } from "./topics"
import { notifications } from "./notifications"

export const students = Router()

students.get("/profile", profile)
students.get("/classes", classes)
students.get("/topics", topics)
students.get("/notifications", notifications)
