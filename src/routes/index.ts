import { Router } from "express"
import { notificationsController } from "./notifications"
import { usersController } from "./users"

export const mainRoutes = Router()

mainRoutes.use("/notifications", notificationsController)
mainRoutes.use("/users", usersController)
