import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateCourseDto } from "./dto"

import type { Request, Response } from "express"

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const course = new CreateAndUpdateCourseDto()

    course.name = req.body.name
    course.description = req.body.description

    const errors = await validateClass(course)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error } = await supabase.from("courses").update(course).eq("id", id)

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
