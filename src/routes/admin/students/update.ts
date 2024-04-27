import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { UpdateStudentDto } from "./dto"

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

    const student = new UpdateStudentDto()

    student.name = req.body.name
    student.email = req.body.email
    student.registration = req.body.registration
    student.document = req.body.document
    student.semester = req.body.semester
    student.course_id = req.body.course_id
    student.auth_user_id = req.body.auth_user_id

    const errors = await validateClass(student)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error: studentsError } = await supabase
      .from("students")
      .update(student)
      .eq("id", id)

    if (studentsError) {
      console.log(studentsError)
      res.status(500).send("Internal server error")
      return
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(
      student.auth_user_id,
      { email: student.email }
    )

    if (authError) {
      console.log(authError)
      res.status(500).send("Internal server error")
      return
    }

    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
