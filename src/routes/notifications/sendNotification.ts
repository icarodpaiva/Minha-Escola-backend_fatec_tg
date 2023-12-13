import { ArrayMinSize, IsArray, IsString, MaxLength } from "class-validator"
import { Type } from "class-transformer"
import axios from "axios"

import type { Request, Response } from "express"

import { validateClass } from "../../utils/validateClass"

class SendNotificationDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  topics!: string[]

  @MaxLength(30)
  @IsString()
  title!: string

  @MaxLength(100)
  @IsString()
  message!: string
}

export async function sendNotification(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const notification = new SendNotificationDto()

    notification.topics = req.body.topics
    notification.title = req.body.title
    notification.message = req.body.message

    const errors = await validateClass(notification)

    if (errors) {
      return res.status(400).send(errors)
    }

    const condition = notification.topics
      .map(topic => `'${topic}' in topics`)
      .join(" || ")

    const { data } = await axios.post<string>(
      "https://fcm.googleapis.com/fcm/send",
      {
        condition,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: null
      },
      {
        headers: {
          Authorization: `key=${process.env.FCM_SERVER_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
