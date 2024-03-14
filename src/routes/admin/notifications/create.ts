import { NOTIFICATION_TOPICS_CHANNELS } from "../../../constants/admin"

import type { Request, Response, NextFunction } from "express"

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const notification = {
      ...req.body,
      topics: NOTIFICATION_TOPICS_CHANNELS,
      staff_id: res.locals.admin_id
    }

    res.locals.notification = notification

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
