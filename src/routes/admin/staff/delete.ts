import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"

interface Staff {
  auth_user_id: string
}

export async function deleteStaff(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const {
      data: staffData,
      error: staffError
    }: { data: Staff[] | null; error: any } = await supabase
      .from("staff")
      .delete()
      .eq("id", id)
      .select("auth_user_id")

    if (staffError) {
      console.log(staffError)
      res.status(500).send("Internal server error")
      return
    }

    if (!staffData?.length) {
      res.status(404).send("Not found")
      return
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(
      staffData[0].auth_user_id
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
