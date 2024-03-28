import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Groups {
  group_id: number
}

export async function topics(_: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    if (is_staff) {
      res.status(400).send("Use staff routes")
      return
    }

    const { data, error } = (await supabase
      .from("students_groups")
      .select("group_id, students()")
      .eq("students.auth_user_id", auth_user_id)
      .not("students", "is", null)) as {
      data: Groups[] | null
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

    const topicsList = data.map(({ group_id }) => group_id)

    res.status(200).send(topicsList)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
