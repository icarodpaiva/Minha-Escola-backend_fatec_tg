import { Router } from "express"

import { isAuthenticated } from "../middlewares/isAuthenticated"
import { isAdmin } from "../middlewares/isAdmin"

import { auth } from "./auth"
import { admin } from "./admin"
import { app } from "./app"

export const mainRoutes = Router()

mainRoutes.use("/auth", auth)
mainRoutes.use("/admin", isAuthenticated, isAdmin, admin)
mainRoutes.use("/app", isAuthenticated, app)
