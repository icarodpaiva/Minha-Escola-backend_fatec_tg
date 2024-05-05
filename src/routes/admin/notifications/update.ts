// Calling this route don't send notification again.

import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateNotificationDto } from "./dto"

interface IsAdmin {
  id: number
  is_admin: boolean
}

import type { Request, Response } from "express"

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const auth_user_id: string = res.locals.auth_user_id

    const {
      data: staff,
      error: staffError
    }: {
      data: IsAdmin[] | null
      error: any
    } = await supabase
      .from("staff")
      .select("id,is_admin")
      .eq("auth_user_id", auth_user_id)
      .limit(1)

    if (staffError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!staff?.length) {
      res.status(404).send("Not found")
      return
    }

    if (!staff[0].is_admin) {
      res.status(403).send("Forbidden")
      return
    }

    const notification = new CreateAndUpdateNotificationDto()

    notification.title = req.body.title
    notification.message = req.body.message
    notification.staff_id = staff[0].id

    const errors = await validateClass(notification)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error } = await supabase
      .from("notifications")
      .update(notification)
      .eq("id", id)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
