import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindGroupFiltersDto, GroupResponse, Group } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindGroupFiltersDto()

    filters.name = (req.query.name || "") as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data, error }: { data: GroupResponse[] | null; error: any } =
      await supabase
        .from("groups")
        .select("*, subjects(name), staff(*)")
        .ilike("name", `%${filters.name}%`)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(200).send([])
    }

    const formattedData: Group[] = data.map(
      ({ subjects, staff, ...group }) => ({
        ...group,
        subject_name: subjects.name,
        teacher_name: staff?.name ?? null
      })
    )

    res.status(200).send(formattedData)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
