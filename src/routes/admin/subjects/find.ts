import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindSubjectFiltersDto, Subject } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindSubjectFiltersDto()

    filters.name = (req.query.name || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data, error }: { data: Subject[] | null; error: any } =
      await supabase
        .from("subjects")
        .select("*")
        .ilike("name", `%${filters.name}%`)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(200).send([])
    }

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
