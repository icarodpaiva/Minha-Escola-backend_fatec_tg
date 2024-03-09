import { Router } from "express"

import { isAuthenticated } from "../../middlewares/isAuthenticated"

import { profile } from "./profile"
import { classes } from "./classes"
import { notifications } from "./notifications"

export const students = Router()

students.get("/profile", isAuthenticated, profile)
students.get("/classes", isAuthenticated, classes)
students.get("/notifications", isAuthenticated, notifications)
