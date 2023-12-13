import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface User {
  id: number
  name: string
  email: string
  ar: string
  document: string
  access_level_id: number
}

export async function profile(_: Request, res: Response) {
  try {
    const auth_user_id: string | undefined = res.locals.auth_user_id

    if (!auth_user_id) {
      res.status(403).send("Forbidden")
      return
    }

    const {
      data: user,
      error: userError
    }: { data: User[] | null; error: any } = await supabase
      .from("users")
      .select("id, name, email, ar, document, access_level_id")
      .eq("auth_user_id", auth_user_id)
      .limit(1)

    if (userError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!user || user.length === 0) {
      res.status(404).send("Not found")
      return
    }

    res.status(200).send(user[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
