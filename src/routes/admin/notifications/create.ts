import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateNotificationDto } from "./dto"

import type { Request, Response } from "express"

export async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const notification = new CreateAndUpdateNotificationDto()

    notification.title = req.body.title
    notification.message = req.body.message
    notification.staff_id = res.locals.admin_id

    const errors = await validateClass(location)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    // TO-DO: Send notification

    res.status(201).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
