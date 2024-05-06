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
      .select(
        "*, locations(building, floor, classroom), groups(name, subjects(name))"
      )
      .order("groups(subjects)", { ascending: true })

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
      return res.status(200).send([])
    }

    const formattedData: Class[] = data.map(
      ({ locations, groups, ...groupClass }) => ({
        ...groupClass,
        location: {
          building: locations.building,
          floor: locations.floor,
          classroom: locations.classroom
        },
        group_name: groups.name,
        subject_name: groups.subjects.name
      })
    )

    res.status(200).send(formattedData)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
