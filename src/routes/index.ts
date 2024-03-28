import { Router } from "express"

import { isAuthenticated } from "../middlewares/isAuthenticated"
import { isAdmin } from "../middlewares/isAdmin"

import { auth } from "./auth"
import { admin } from "./admin"
import { students } from "./students"

export const mainRoutes = Router()

mainRoutes.use("/auth", auth)
mainRoutes.use("/admin", isAuthenticated, isAdmin, admin)
mainRoutes.use("/students", isAuthenticated, students)
