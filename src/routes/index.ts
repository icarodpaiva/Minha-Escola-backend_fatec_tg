import { Router } from "express"

import { sendNotification } from "./notifications/sendNotification"
import { getUser } from "./users/getUser"

export const mainRoutes = Router()

// Notifications routes
mainRoutes.post('/notifications', sendNotification)

// Users routes
mainRoutes.get("/users/:id", getUser)
