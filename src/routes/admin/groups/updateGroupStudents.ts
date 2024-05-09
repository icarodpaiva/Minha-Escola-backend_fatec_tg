import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { UpdateGroupStudentsDto } from "./dto"

import type { Request, Response } from "express"

export async function updateGroupStudents(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const groupStudents = new UpdateGroupStudentsDto()

    groupStudents.group_id = parseInt(id, 10)
    groupStudents.students = req.body.students

    const errors = await validateClass(groupStudents)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error: deleteError } = await supabase
      .from("students_groups")
      .delete()
      .eq("group_id", groupStudents.group_id)

    if (deleteError) {
      console.log(deleteError)
      res.status(500).send("Internal server error")
      return
    }

    const inserts = groupStudents.students.map(student_id => ({
      group_id: groupStudents.group_id,
      student_id
    }))

    const { error: insertError } = await supabase
      .from("students_groups")
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
