import {
  IsInt,
  ArrayMinSize,
  IsArray,
  MaxLength,
  IsString
} from "class-validator"

import { supabase } from "../databases/supabase"
import {
  ALLOWED_TO_SEND_NOTIFICATIONS,
  ADMIN
} from "../constants/access_levels"
import { validateClass } from "../utils/validateClass"

import type { NextFunction, Request, Response } from "express"

export class SendNotificationDto {
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
}

interface Groups {
  groups: {
    id: number
  }
}

interface User {
  access_level_id: number
}

export async function notificationTopics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth_user_id: string | undefined = res.locals.auth_user_id

    if (!auth_user_id) {
      res.status(403).send("Forbidden")
      return
    }

    const {
      data: user,
      error: userError
    }: { data: User[] | null; error: any } = await supabase
      .from("users")
      .select("access_level_id")
      .eq("auth_user_id", auth_user_id)
      .limit(1)

    if (
      userError ||
      !user ||
      user.length === 0 ||
      !ALLOWED_TO_SEND_NOTIFICATIONS.includes(user[0].access_level_id)
    ) {
      res.status(403).send("Forbidden")
      return
    }

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const notification = new SendNotificationDto()

    notification.topics = req.body.topics
    notification.title = req.body.title
    notification.message = req.body.message

    const errors = await validateClass(notification)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    if (user[0].access_level_id === ADMIN) {
      const {
        data: groups,
        error: groupsError
      }: { data: Groups["groups"][] | null; error: any } = await supabase
        .from("groups")
        .select("id")
        .in("id", notification.topics)

      if (groupsError) {
        console.log(groupsError)
        res.status(500).send("Internal server error")
        return
      }

      if (
        !groups ||
        groups.length === 0 ||
        groups.length !== notification.topics.length
      ) {
        res.status(400).send("Invalid topics")
        return
      }

      next()
    }

    // Teacher
    else {
      const { data: groups, error: groupsError } = (await supabase
        .from("users_groups")
        .select("groups(id), users()")
        .eq("users.auth_user_id", auth_user_id)
        .not("users", "is", null)
        .not("groups", "is", null)) as {
        data: Groups[] | null
        error: any
      }

      if (groupsError || !groups || groups.length === 0) {
        res.status(403).send("Forbidden")
        return
      }

      const teacherTopics = groups.map(({ groups: { id } }) => id)

      const isAllowed = notification.topics.every(topic =>
        teacherTopics.includes(topic)
      )

      if (!isAllowed) {
        res.status(403).send("Forbidden")
        return
      }

      next()
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
