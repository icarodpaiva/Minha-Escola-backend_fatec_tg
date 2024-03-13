import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateGroupDto } from "./dto"

import type { Request, Response } from "express"

export async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const group = new CreateAndUpdateGroupDto()

    group.name = req.body.name
    group.year = req.body.year
    group.semester = req.body.semester
    group.capacity = req.body.capacity
    group.subject_id = req.body.subject_id
    group.teacher_id = req.body.teacher_id ?? null

    const errors = await validateClass(group)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error } = await supabase.from("groups").insert(group)

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
