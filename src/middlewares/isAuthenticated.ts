import { supabase } from "../databases/supabase"

import type { Request, Response, NextFunction } from "express"

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.headers.authorization

    if (!accessToken) {
      res.status(403).send("Forbidden")
      return
    }
    const { data: authenticatedUser, error: authenticatedUserError } =
      await supabase.auth.getUser(accessToken)

    if (authenticatedUserError || !authenticatedUser) {
      res.status(403).send("Forbidden")
      return
    }

    res.locals.auth_user_id = authenticatedUser.user.id
    res.locals.is_staff = authenticatedUser.user.user_metadata.is_staff
    res.locals.is_admin = authenticatedUser.user.user_metadata.is_admin

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
