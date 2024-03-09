import { Router } from "express"

import { authenticated } from "../../middlewares/authenticated"

import { profile } from "./profile"
import { classes } from "./classes"
import { notifications } from "./notifications"

export const students = Router()

students.get("/profile", authenticated, profile)
students.get("/classes", authenticated, classes)
students.get("/notifications", authenticated, notifications)
