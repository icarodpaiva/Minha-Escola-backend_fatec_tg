import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Staff {
  id: number
  name: string
  email: string
  document: string

  // Prevent typescript error, but this property doesn't exist to staff users
  courses?: {
    name: string
  }
}

interface Student extends Staff {
  sr: string
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

    let data: Staff[] | Student[] | null
    let error: any

    if (is_staff) {
      const { data: staffData, error: staffError } = (await supabase
        .from("staff")
        .select("id, name, email, document")
        .eq("auth_user_id", auth_user_id)
        .limit(1)) as { data: Staff[] | null; error: any }

      data = staffData
      error = staffError
    } else {
      const { data: studentData, error: studentError } = (await supabase
        .from("students")
        .select("id, name, email, sr, document, semester, courses(name)")
        .eq("auth_user_id", auth_user_id)
        .limit(1)) as { data: Student[] | null; error: any }

      data = studentData
      error = studentError
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

    const { courses, ...profile } = data[0]

    const formattedProfile: Staff | FormattedStudent = is_staff
      ? profile
      : {
          ...profile,
          course: courses?.name
        }

    res.status(200).send(formattedProfile)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
