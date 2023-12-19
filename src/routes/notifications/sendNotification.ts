import axios from "axios"

import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"
import type { SendNotificationDto } from "../../middlewares/notificationTopics"

export async function sendNotification(req: Request, res: Response) {
  try {
    const notification = req.body as SendNotificationDto

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
        message: notification.message
      })

    if (notificationError) {
      console.log(notificationError)
      res.status(500).send("Internal server error")
      return
    }

    const {
      error: groupNotificationsError
    }: { data: Notification[] | null; error: any } = await supabase
      .from("groups_notifications")
      .insert(
        notification.topics.map(group_id => ({ group_id, notification_id }))
      )

    if (groupNotificationsError) {
      console.log(groupNotificationsError)
      res.status(500).send("Internal server error")
      return
    }

    res.status(200).send("OK")
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
