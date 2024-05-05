import { supabase } from "../../../databases/supabase"
import { GroupNotifications } from "./dto"

import type { Request, Response } from "express"

export async function findGroupNotifications(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error } = (await supabase
      .from("groups_notifications")
      .select("id, notifications(id, title, message, staff(id, name))")
      .eq("group_id", parseInt(id, 10))) as {
      data: GroupNotifications[] | null
      error: any
    }

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(200).send([])
    }

    const formattedCourseSubjects = data.map(({ id, notifications }) => {
      const { staff, ...notification } = notifications

      return {
        id,
        notification,
        staff
      }
    })

    res.status(200).send(formattedCourseSubjects)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
