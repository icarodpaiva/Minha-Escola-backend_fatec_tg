import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"
import type { CourseSubjectType } from "./dto"

export async function findCourseSubjects(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error } = (await supabase
      .from("courses_subjects")
      .select("id, semester, subjects(id, name)")
      .eq("course_id", parseInt(id, 10))) as {
      data: CourseSubjectType[] | null
      error: any
    }

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(200).send([])
    }

    const formattedCourseSubjects = data.map(
      ({ subjects: subject, ...rest }) => ({
        ...rest,
        subject
      })
    )

    res.status(200).send(formattedCourseSubjects)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
