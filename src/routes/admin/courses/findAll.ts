import type { Request, Response } from "express"

import { supabase } from "../../../databases/supabase"

import type { Course } from "./dto"

export async function findAll(_: Request, res: Response) {
  try {
    const { data, error }: { data: Course[] | null; error: any } =
      await supabase.from("courses").select("*")

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
