import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindStudentFiltersDto, StudentResponse, Student } from "./dto"

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
      .select("*, courses(name)")
      .ilike("name", `%${filters.name}%`)
      .order("id")

    if (filters.semester) {
      query.eq("semester", filters.semester)
    }

    if (filters.course_id) {
      query.eq("course_id", filters.course_id)
    }

    const { data, error }: { data: StudentResponse[] | null; error: any } =
      await query

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(404).send("Not found")
    }

    const formattedData: Student[] = data?.map(({ courses, ...student }) => ({
      ...student,
      course_name: courses.name
    }))

    res.status(200).send(formattedData)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
