import { Router } from "express"
import { notificationsController } from "./notifications/notifications.controller"

export const mainRoutes = Router()

mainRoutes.use("/notifications", notificationsController)
