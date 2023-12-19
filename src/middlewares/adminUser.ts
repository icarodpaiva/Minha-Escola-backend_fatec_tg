import { supabase } from "../databases/supabase"

import { ADMIN } from "../constants/access_levels"

import type { NextFunction, Request, Response } from "express"

export async function adminUser(_: Request, res: Response, next: NextFunction) {
  try {
    const auth_user_id: string = res.locals.auth_user_id

    const {
      count: userCount,
      error: userError
    }: {
      count: number | null
      error: any
    } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("auth_user_id", auth_user_id)
      .eq("access_level_id", ADMIN)
      .limit(1)

    if (userError || !userCount) {
      res.status(403).send("Forbidden")
      return
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
