import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateAndUpdateStudentDto } from "./dto"

import type { Request, Response } from "express"

export async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const student = new CreateAndUpdateStudentDto()

    student.name = req.body.name
    student.email = req.body.email
    student.document = req.body.document
    student.sr = req.body.sr
    student.semester = req.body.semester
    student.course_id = req.body.course_id

    const errors = await validateClass(student)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: student.email,
      password: student.document,
      options: {
        data: {
          is_staff: false
        }
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
