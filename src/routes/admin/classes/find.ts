import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindClassFiltersDto, Class } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindClassFiltersDto()

    filters.name = (req.query.name || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data, error }: { data: Class[] | null; error: any } = await supabase
      .from("classes")
      .select("*")
      .ilike("name", `%${filters.name}%`)

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
