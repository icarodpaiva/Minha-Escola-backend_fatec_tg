import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"
import type { GroupStudentsType } from "./dto"

export async function findGroupStudents(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error } = (await supabase
      .from("students_groups")
      .select("id, students(id, name, email, semester, courses(name))")
      .eq("group_id", id)) as {
      data: GroupStudentsType[] | null
      error: any
    }

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      res.status(404).send("Not found")
      return
    }

    const formattedGroupStudents = data.map(({ id, students }) => {
      const { courses, ...student } = students

      return {
        id,
        student: { ...student, course: courses.name }
      }
    })

    res.status(200).send(formattedGroupStudents)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
