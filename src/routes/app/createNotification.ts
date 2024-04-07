import { IsInt, ArrayMinSize, IsArray } from "class-validator"

import { supabase } from "../../databases/supabase"
import { validateClass } from "../../utils/validateClass"

import type { Request, Response, NextFunction } from "express"

class CreateNotificationDto {
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  topics!: number[]
}

interface Group {
  id: number
  teacher_id: number
}

export async function createNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    if (!is_staff) {
      return res.status(403).send("Forbidden")
    }

    const notification = new CreateNotificationDto()

    notification.topics = req.body.topics

    const errors = await validateClass(notification)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { data, error } = (await supabase
      .from("groups")
      .select("id, teacher_id, staff()")
      .eq("staff.auth_user_id", auth_user_id)
      .not("staff", "is", null)) as {
      data: Group[] | null
      error: any
    }

    if (error) {
      console.log(error)
      return res.status(500).send("Internal server error")
    }

    if (!data?.length) {
      return res.status(404).send("Not found")
    }

    const groups = data.map(group => group.id)

    const isTeacher = notification.topics.every(topic => groups.includes(topic))

    if (!isTeacher) {
      return res.status(403).send("Forbidden")
    }

    res.locals.notification = {
      ...req.body,
      staff_id: data[0].teacher_id
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
