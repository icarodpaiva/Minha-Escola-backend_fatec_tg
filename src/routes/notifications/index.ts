import { Router } from "express"
import { sendNotification } from "./sendNotification"

export const notificationsController = Router()

notificationsController.post("/", sendNotification)
