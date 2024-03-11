import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindNotificationFiltersDto, Notification } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindNotificationFiltersDto()

    filters.title = (req.query.title ?? "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data, error }: { data: Notification[] | null; error: any } =
      await supabase
        .from("notifications")
        .select("*")
        .ilike("title", `%${filters.title}%`)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
