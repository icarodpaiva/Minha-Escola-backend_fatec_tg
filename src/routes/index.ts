import { Router } from "express"
import { notificationsController } from "./notifications/notifications.controller"
import { usersController } from "./users"

export const mainRoutes = Router()

mainRoutes.use("/notifications", notificationsController)
mainRoutes.use("/users", usersController)
