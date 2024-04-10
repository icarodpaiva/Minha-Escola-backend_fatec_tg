import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"
import type { GroupResponse, Group } from "./dto"

export async function findById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error }: { data: GroupResponse[] | null; error: any } = await supabase
      .from("groups")
      .select("*, subjects(name), staff(name)")
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

    const formattedData: Group[] = data.map(({subjects, staff, ...group}) => ({
      ...group,
      subject_name: subjects.name,
      teacher_name: staff?.name ?? null
    }))

    res.status(200).send(formattedData[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
