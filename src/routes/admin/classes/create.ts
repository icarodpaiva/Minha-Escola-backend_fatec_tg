import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateClassDto } from "./dto"

import type { Request, Response } from "express"

export async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const groupClass = new CreateAndUpdateClassDto()

    groupClass.name = req.body.name
    groupClass.description = req.body.description
    groupClass.date = req.body.date
    groupClass.start_time = req.body.start_time
    groupClass.end_time = req.body.end_time
    groupClass.group_id = req.body.group_id
    groupClass.location_id = req.body.location_id

    const errors = await validateClass(groupClass)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    groupClass.start_time = `${groupClass.start_time}:00`
    groupClass.end_time = `${groupClass.end_time}:00`

    const { error } = await supabase.from("classes").insert(groupClass)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(201).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
