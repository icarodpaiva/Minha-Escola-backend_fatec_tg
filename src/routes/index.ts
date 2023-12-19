import { Router } from "express"

import { authenticated } from "../middlewares/authenticated"
import { notificationTopics } from "../middlewares/notificationTopics"
import { adminUser } from "../middlewares/adminUser"

import { login } from "./auth/login"

import { sendNotification } from "./notifications/sendNotification"

import { profile } from "./users/profile"
import { getUser } from "./users/getUser"

import { getClasses } from "./classes/getClasses"

export const mainRoutes = Router()

// Auth routes
mainRoutes.post("/auth/login", login)

// Notifications routes
mainRoutes.post(
  "/notifications",
  authenticated,
  notificationTopics,
  sendNotification
)

// Users routes
mainRoutes.get("/users/profile", authenticated, profile)
mainRoutes.get("/users/:id", authenticated, adminUser, getUser)

// Classes routes
mainRoutes.get("/classes", authenticated, getClasses)
