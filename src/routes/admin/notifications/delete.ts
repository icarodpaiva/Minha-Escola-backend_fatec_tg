import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"

export async function deleteNotification(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { error: groupsNotificationsError } = await supabase
      .from("groups_notifications")
      .delete()
      .eq("notification_id", id)

    if (groupsNotificationsError) {
      console.log(groupsNotificationsError)
      res.status(500).send("Internal server error")
      return
    }

    const { error: notificationsError } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id)

    if (notificationsError) {
      console.log(notificationsError)
      res.status(500).send("Internal server error")
      return
    }

    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
