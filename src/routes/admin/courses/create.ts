import type { Request, Response } from "express"

import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"

import { CreateAndUpdateCourseDto } from "./dto"

export async function create(req: Request, res: Response) {
  try {
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

    const { error } = await supabase.from("courses").insert(course)

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
