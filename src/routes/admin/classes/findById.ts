import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"
import type { ClassResponse, Class } from "./dto"

export async function findById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error }: { data: ClassResponse[] | null; error: any } =
      await supabase
        .from("classes")
        .select(
          "*, locations(building, floor, classroom), groups(name, subjects(name))"
        )
        .eq("id", id)
        .limit(1)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      res.status(404).send("Not found")
      return
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

    res.status(200).send(formattedData[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
