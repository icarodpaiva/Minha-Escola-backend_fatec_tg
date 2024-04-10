import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindClassFiltersDto, ClassResponse, Class } from "./dto"

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
      .select("*, locations(building, floor, classroom)")

    if (filters.name) {
      query.ilike("name", `%${filters.name}%`)
    }

    if (filters.description) {
      query.ilike("description", `%${filters.description}%`)
    }

    const { data, error }: { data: ClassResponse[] | null; error: any } =
      await query

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(404).send("Not found")
    }

    const formattedData: Class[] = data.map(({ locations, ...groupClass }) => ({
      ...groupClass,
      location: {
        building: locations.building,
        floor: locations.floor,
        classroom: locations.classroom
      }
    }))

    res.status(200).send(formattedData)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
