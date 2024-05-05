import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateStudentDto } from "./dto"

import type { Request, Response } from "express"

export async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const student = new CreateStudentDto()

    student.name = req.body.name
    student.email = req.body.email
    student.registration = req.body.registration
    student.document = req.body.document
    student.semester = req.body.semester
    student.course_id = req.body.course_id

    const errors = await validateClass(student)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: student.email,
        password: student.document,
        email_confirm: true,
        user_metadata: {
          is_staff: false,
          is_admin: false
        }
      })

    if (authError || !authData.user) {
      console.log(authError)
      res.status(500).send("Internal server error")
      return
    }

    const { error } = await supabase
      .from("students")
      .insert({ ...student, auth_user_id: authData.user.id })

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
