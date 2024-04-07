import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindClassFiltersDto, Class } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindClassFiltersDto()

    filters.name = (req.query.name || "") as string
    filters.description = (req.query.description || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const query = supabase
      .from("classes")
      .select("*")

    if (filters.name) {
      query.ilike("name", `%${filters.name}%`)
    }

    if (filters.description) {
      query.ilike("description", `%${filters.description}%`)
    }

    const { data, error }: { data: Class[] | null; error: any } = await query

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
