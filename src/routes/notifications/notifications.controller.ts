import { Router, Request, Response } from "express"
import { ValidationError, validate } from "class-validator"

import { CreateNotificationDto } from "./dto/create-notification.dto"

import { createNotificationService } from "./notifications.service"

export const notificationsController = Router()

notificationsController.post("/", createNotificationRoute)

async function createNotificationRoute(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const notification = new CreateNotificationDto()

    notification.topics = req.body.topics
    notification.title = req.body.title
    notification.message = req.body.message

    const errors: ValidationError[] = await validate(notification)

    if (errors.length > 0) {
      return res
        .status(400)
        .send(
          errors
            .map(error => Object.values(error.constraints ?? {}).join(", "))
            .join(", ")
        )
    }

    const data = await createNotificationService(notification)

    res.status(200).send(data)
  } catch (error) {
    console.log(
      'Error in notifications.controller.ts - notificationsRoutes.post("/")',
      error
    )
    res.status(500).send("Internal server error")
  }
}
