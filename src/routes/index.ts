import { Router } from "express"

import { sendNotification } from "./notifications/sendNotification"
import { getUser } from "./users/getUser"
import { getGroups } from "./groups/getGroups"

export const mainRoutes = Router()

// Notifications routes
mainRoutes.post('/notifications', sendNotification)

// Users routes
mainRoutes.get("/users/:id", getUser)

// Groups routes
mainRoutes.get('/groups', getGroups)