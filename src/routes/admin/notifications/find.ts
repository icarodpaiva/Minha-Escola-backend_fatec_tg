import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindNotificationFiltersDto, NotificationResponse, Notification } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindNotificationFiltersDto()

    filters.title = (req.query.title || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data, error }: { data: NotificationResponse[] | null; error: any } =
      await supabase
        .from("notifications")
        .select("*, staff(name)")
        .ilike("title", `%${filters.title}%`)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(404).send("Not found")
    }

    const formattedData: Notification[] = data.map(({staff, ...notification}) => ({
      ...notification,
      staff_name: staff.name
    }))

    res.status(200).send(formattedData)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
