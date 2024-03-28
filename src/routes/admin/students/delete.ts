import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"

interface Student {
  auth_user_id: string
}

export async function deleteStudent(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const {
      data: studentsData,
      error: studentsError
    }: { data: Student[] | null; error: any } = await supabase
      .from("students")
      .delete()
      .eq("id", id)
      .select("auth_user_id")

    if (studentsError) {
      console.log(studentsError)
      res.status(500).send("Internal server error")
      return
    }

    if (!studentsData?.length) {
      res.status(404).send("Not found")
      return
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(
      studentsData[0].auth_user_id
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
