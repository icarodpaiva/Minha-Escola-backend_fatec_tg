import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { CreateStaffDto } from "./dto"

import type { Request, Response } from "express"

export async function create(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const staff = new CreateStaffDto()

    staff.name = req.body.name
    staff.email = req.body.email
    staff.document = req.body.document
    staff.is_admin = req.body.is_admin

    const errors = await validateClass(staff)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: staff.email,
        password: staff.document,
        user_metadata: {
          is_staff: true
        }
      })

    if (authError || !authData.user) {
      console.log(authError)
      res.status(500).send("Internal server error")
      return
    }

    const { error } = await supabase
      .from("staff")
      .insert({ ...staff, auth_user_id: authData.user.id })

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(201).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
