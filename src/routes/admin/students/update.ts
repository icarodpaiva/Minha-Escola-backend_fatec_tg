import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateSubjectDto } from "./dto"

import type { Request, Response } from "express"

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const subject = new CreateAndUpdateSubjectDto()

    subject.name = req.body.name
    subject.description = req.body.description

    const errors = await validateClass(subject)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error } = await supabase
      .from("subjects")
      .update(subject)
      .eq("id", id)

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
