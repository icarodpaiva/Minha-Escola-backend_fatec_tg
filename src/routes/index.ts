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

// TO-DO - Refactoring
import { notificationTopics } from "../middlewares/notificationTopics"
import { sendNotification } from "./notifications/sendNotification"
import { getNotifications } from "./notifications/getNotifications"

// Notifications routes
mainRoutes.post(
  "/notifications",
  isAuthenticated,
  notificationTopics,
  sendNotification
)
mainRoutes.get("/notifications", isAuthenticated, getNotifications)
