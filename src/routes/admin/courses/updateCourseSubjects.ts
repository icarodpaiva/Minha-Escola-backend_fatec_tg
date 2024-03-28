import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { UpdateCourseSubjectsDto } from "./dto"

import type { Request, Response } from "express"

export async function updateCourseSubjects(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const courseSubjects = new UpdateCourseSubjectsDto()

    courseSubjects.course_id = parseInt(id, 10)
    courseSubjects.subjects = req.body.subjects

    const errors = await validateClass(courseSubjects)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error: deleteError } = await supabase
      .from("courses_subjects")
      .delete()
      .eq("course_id", courseSubjects.course_id)

    if (deleteError) {
      console.log(deleteError)
      res.status(500).send("Internal server error")
      return
    }

    const inserts = courseSubjects.subjects.map(subject => ({
      course_id: courseSubjects.course_id,
      ...subject
    }))

    const { error: insertError } = await supabase
      .from("courses_subjects")
      .insert(inserts)

    if (insertError) {
      console.log(insertError)
      res.status(500).send("Internal server error")
      return
    }

    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
