import { Router } from "express"

import { auth } from "./auth"
import { admin } from "./admin"
import { students } from "./students"

export const mainRoutes = Router()

mainRoutes.post("/auth", auth)
mainRoutes.use("/admin", admin)
mainRoutes.use("/students", students)

// TO-DO - Refactoring
import { authenticated } from "../middlewares/authenticated"
import { notificationTopics } from "../middlewares/notificationTopics"
import { sendNotification } from "./notifications/sendNotification"
import { getNotifications } from "./notifications/getNotifications"

// Notifications routes
mainRoutes.post(
  "/notifications",
  authenticated,
  notificationTopics,
  sendNotification
)
mainRoutes.get("/notifications", authenticated, getNotifications)
