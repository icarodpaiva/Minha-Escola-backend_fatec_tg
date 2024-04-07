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

import type { Request, Response } from "express"

export async function updateClassDetails(req: Request, res: Response) {
  try {
    // TO-DO: Teachers just can edit its classes
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff
    const { id } = req.params

    if (!is_staff) {
      res.status(403).send("Forbidden")
      return
    }

    if (!id) {
      res.status(400).send("Missing id parameter")
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
      .select()

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
