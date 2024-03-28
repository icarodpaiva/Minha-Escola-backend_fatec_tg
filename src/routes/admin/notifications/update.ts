// Calling this route don't send notification again.

import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateNotificationDto } from "./dto"

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

    const notification = new CreateAndUpdateNotificationDto()

    notification.title = req.body.title
    notification.message = req.body.message
    notification.staff_id = res.locals.admin_id

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
