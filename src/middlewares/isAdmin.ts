import { supabase } from "../databases/supabase"

import type { Request, Response, NextFunction } from "express"

interface IsAdmin {
  is_admin: boolean
}

export async function isAdmin(_: Request, res: Response, next: NextFunction) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    if (!is_staff) {
      res.status(403).send("Forbidden")
      return
    }

    const {
      data: staff,
      error: staffError
    }: {
      data: IsAdmin[] | null
      error: any
    } = await supabase
      .from("staff")
      .select("is_admin")
      .eq("auth_user_id", auth_user_id)
      .limit(1)

    if (staffError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!staff || !staff.length) {
      res.status(404).send("Not found")
      return
    }

    if (!staff[0].is_admin) {
      res.status(403).send("Forbidden")
      return
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
