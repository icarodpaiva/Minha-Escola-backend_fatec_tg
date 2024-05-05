import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Group {
  groups: {
    id: number
    name: string
    subjects: { name: string }
  }
}

interface FormattedGroup extends Omit<Group["groups"], "subjects"> {
  subject: string
}

export async function groups(_: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    const query = supabase
      .from("students_groups")
      .select("groups(id, name, subjects(name), staff()), students()")
      .not("groups", "is", null)

    if (is_staff) {
      query
        .eq("groups.staff.auth_user_id", auth_user_id)
        .not("groups.staff", "is", null)
    } else {
      query
        .eq("students.auth_user_id", auth_user_id)
        .not("students", "is", null)
    }

    const { data, error } = (await query) as {
      data: Group[] | null
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

    const formattedGroups: FormattedGroup[] = data.map(({ groups }) => {
      const { id, name, subjects } = groups

      return {
        id,
        name,
        subject: subjects.name
      }
    })

    res.status(200).send(formattedGroups)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
