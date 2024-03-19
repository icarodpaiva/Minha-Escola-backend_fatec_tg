import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindStudentFiltersDto, Student } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindStudentFiltersDto()

    filters.name = (req.query.name || "") as string
    filters.semester = (req.query.semester || "") as string
    filters.course_id = (req.query.course_id || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const query = supabase
      .from("students")
      .select("*")
      .ilike("name", `%${filters.name}%`)

    if (filters.semester) {
      query.eq("semester", filters.semester)
    }

    if (filters.course_id) {
      query.eq("course_id", filters.course_id)
    }

    const { data, error }: { data: Student[] | null; error: any } = await query

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
