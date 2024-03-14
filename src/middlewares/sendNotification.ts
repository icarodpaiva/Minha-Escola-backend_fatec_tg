import axios from "axios"
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  MaxLength
} from "class-validator"

import { validateClass } from "../utils/validateClass"
import { supabase } from "../databases/supabase"

import type { Request, Response } from "express"

class SendNotificationDto {
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  topics!: number[]

  @MaxLength(50)
  @IsString()
  title!: string

  @MaxLength(200)
  @IsString()
  message!: string

  @IsInt()
  staff_id!: number
}

export async function sendNotification(_: Request, res: Response) {
  try {
    const notification = new SendNotificationDto()

    notification.topics = res.locals.notification.topics
    notification.title = res.locals.notification.title
    notification.message = res.locals.notification.message
    notification.staff_id = res.locals.notification.staff_id

    const errors = await validateClass(notification)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const condition = notification.topics
      .map(topic => `'${topic}' in topics`)
      .join(" || ")

    const {
      data: { message_id }
    } = await axios.post<{ message_id: string }>(
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

    const notification_id = Number(message_id)

    const { error: notificationError }: { error: any } = await supabase
      .from("notifications")
      .insert({
        id: notification_id,
        title: notification.title,
        message: notification.message,
        staff_id: notification.staff_id
      })

    if (notificationError) {
      console.log(notificationError)
      res.status(500).send("Internal server error")
      return
    }

    const { error: groupNotificationsError }: { error: any } = await supabase
      .from("groups_notifications")
      .insert(
        notification.topics.map(group_id => ({ group_id, notification_id }))
      )

    if (groupNotificationsError) {
      console.log(groupNotificationsError)
      res.status(500).send("Internal server error")
      return
    }

    res.status(201).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
