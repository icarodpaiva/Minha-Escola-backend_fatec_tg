import { IsOptional, IsString } from "class-validator"

import { supabase } from "../../databases/supabase"
import { validateClass } from "../../utils/validateClass"

export class UpdateClassDetailsDto {
  @IsOptional()
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description!: string
}

interface IsTeacher {
  groups: {
    staff: {
      auth_user_id: string
    }
  }
}

import type { Request, Response } from "express"

export async function updateClassDetails(req: Request, res: Response) {
  try {
    const is_staff: boolean = res.locals.is_staff
    const { id } = req.params
    const auth_user_id: string = res.locals.auth_user_id

    if (!is_staff) {
      res.status(403).send("Forbidden")
      return
    }

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data: isTeacher, error: isTeacherError } = (await supabase
      .from("classes")
      .select("groups(staff(auth_user_id))")
      .eq("id", id)
      .eq("groups.staff.auth_user_id", auth_user_id)
      .not("groups", "is", null)
      .not("groups.staff", "is", null)) as {
      data: IsTeacher[] | null
      error: any
    }

    if (isTeacherError) {
      console.log(isTeacherError)
      res.status(500).send("Internal server error")
      return
    }

    if (!isTeacher?.length) {
      res.status(403).send("Forbidden")
      return
    }

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const classDetails = new UpdateClassDetailsDto()

    classDetails.name = req.body.name
    classDetails.description = req.body.description

    const errors = await validateClass(classDetails)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error } = await supabase
      .from("classes")
      .update(classDetails)
      .eq("id", id)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
