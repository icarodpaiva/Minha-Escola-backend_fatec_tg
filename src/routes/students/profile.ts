import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Student {
  id: number
  name: string
  email: string
  sr: string
  document: string
  semester: number
  courses: {
    name: string
  }
}

interface FormattedStudent extends Omit<Student, "courses"> {
  course: string
}

export async function profile(_: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    if (is_staff) {
      res.status(400).send("Use staff routes")
      return
    }

    const { data, error } = (await supabase
      .from("students")
      .select("id, name, email, sr, document, semester, courses(name)")
      .eq("auth_user_id", auth_user_id)
      .limit(1)) as { data: Student[] | null; error: any }

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      res.status(404).send("Not found")
      return
    }

    const formattedProfile: FormattedStudent = data.map(student => {
      const { courses, ...rest } = student

      return {
        ...rest,
        course: courses.name
      }
    })[0]

    res.status(200).send(formattedProfile)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
