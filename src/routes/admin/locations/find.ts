import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindLocationFiltersDto, Location } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindLocationFiltersDto()

    filters.building = (req.query.building || "") as string
    filters.classroom = (req.query.classroom || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data, error }: { data: Location[] | null; error: any } =
      await supabase
        .from("locations")
        .select("*")
        .ilike("building", `%${filters.building}%`)
        .ilike("classroom", `%${filters.classroom}%`)
        .order("building", { ascending: true })

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
