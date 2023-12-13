import { supabase } from "../databases/supabase"

import type { NextFunction, Request, Response } from "express"

export async function authenticated(
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

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
