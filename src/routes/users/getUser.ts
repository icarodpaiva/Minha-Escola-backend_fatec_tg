import { IsNumberString } from "class-validator"

import { supabase } from "../../databases/supabase"
import { validateClass } from "../../utils/validateClass"

import type { Request, Response } from "express"

class GetUserParams {
  @IsNumberString()
  id!: string
}

interface User {
  id: number
  name: string
  email: string
  ar: string
  document: string
  access_level_id: number
}

export async function getUser(req: Request, res: Response) {
  try {
    const params = new GetUserParams()

    params.id = req.params.id

    const errors = await validateClass(params)

    if (errors) {
      return res.status(400).send(errors)
    }

    const {
      data: user,
      error: userError
    }: { data: User[] | null; error: any } = await supabase
      .from("users")
      .select("id, name, email, ar, document, access_level_id")
      .eq("id", params.id)
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
