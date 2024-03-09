import { Router } from "express"

import { isAuthenticated } from "../../middlewares/isAuthenticated"
import { isAdmin } from "../../middlewares/isAdmin"

import { courses } from "./courses"

export const admin = Router()

admin.use("/courses", isAuthenticated, isAdmin, courses)
