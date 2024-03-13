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

    const { data, error }: { data: CourseSubjectType[] | null; error: any } =
      await supabase.from("courses_subjects").select("*").eq("course_id", id)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
