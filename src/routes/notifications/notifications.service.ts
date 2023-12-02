import axios from "axios"

import { CreateNotificationDto } from "./dto/create-notification.dto"

export const createNotificationService = async (
  notification: CreateNotificationDto
): Promise<string> => {
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

  return data
}
