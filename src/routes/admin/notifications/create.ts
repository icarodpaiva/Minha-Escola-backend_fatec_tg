import { supabase } from "../../../databases/supabase"
import { NOTIFICATION_TOPICS_CHANNELS } from "../../../constants/admin"

import type { Request, Response, NextFunction } from "express"

interface IsAdmin {
  id: number
  is_admin: boolean
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
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

    const notification = {
      ...req.body,
      topics: NOTIFICATION_TOPICS_CHANNELS,
      staff_id: staff[0].id
    }

    res.locals.notification = notification

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
