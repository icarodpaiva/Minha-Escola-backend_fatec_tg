import type { Request, Response, NextFunction } from "express"

export async function isAdmin(_: Request, res: Response, next: NextFunction) {
  try {
    const is_admin: boolean = res.locals.is_admin

    if (!is_admin) {
      res.status(403).send("Forbidden")
      return
    }

    next()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
