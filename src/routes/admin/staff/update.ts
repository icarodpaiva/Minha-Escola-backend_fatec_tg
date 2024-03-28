import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { UpdateStaffDto } from "./dto"

import type { Request, Response } from "express"

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const staff = new UpdateStaffDto()

    staff.name = req.body.name
    staff.email = req.body.email
    staff.document = req.body.document
    staff.is_admin = req.body.is_admin
    staff.auth_user_id = req.body.auth_user_id

    const errors = await validateClass(staff)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { error: staffError } = await supabase
      .from("staff")
      .update(staff)
      .eq("id", id)

    if (staffError) {
      console.log(staffError)
      res.status(500).send("Internal server error")
      return
    }

    const { error: authError } = await supabase.auth.admin.updateUserById(
      staff.auth_user_id,
      { email: staff.email }
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
