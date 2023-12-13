import { IsEmail, IsString, IsNotEmpty } from "class-validator"

import { supabase } from "../../databases/supabase"
import { validateClass } from "../../utils/validateClass"

import type { Request, Response } from "express"

class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}

export async function login(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).send("Missing body")
    }

    const credentials = new LoginDto()

    credentials.email = req.body.email
    credentials.password = req.body.password

    const errors = await validateClass(credentials)

    if (errors) {
      res.status(400).send(errors)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error || !data.user || !data.session) {
      res.status(400).send("Invalid credentials")
      return
    }

    res.status(200).send({ access_token: data.session.access_token })
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
