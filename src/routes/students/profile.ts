import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Student {
  id: number
  name: string
  email: string
  sr: string
  document: string
}

export async function profile(_: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    if (is_staff) {
      res.status(400).send("Use staff routes")
      return
    }

    const {
      data: student,
      error: studentError
    }: { data: Student[] | null; error: any } = await supabase
      .from("students")
      .select("id, name, email, sr, document")
      .eq("auth_user_id", auth_user_id)
      .limit(1)

    if (studentError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!student?.length) {
      res.status(404).send("Not found")
      return
    }

    res.status(200).send(student[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
