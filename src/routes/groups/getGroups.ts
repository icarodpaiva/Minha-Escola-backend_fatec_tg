import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface User {
  id: string
  name: string
  email: string
  ar: string
  document: string
  access_level_id: number
}

export async function getGroups(req: Request, res: Response) {
  try {

    const {
      data: group,
      error: groupError
    }: { data: User[] | null; error: any } = await supabase
      .from("classes")
      .select(`
        id,
        start_time,
        end_time,
        locations(
          building,
          floor,
          classroom
        ),
        subjects(name)
      `)
    
    if (groupError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!group || group.length === 0) {
      res.status(404).send("Not found")
      return
    }

    res.status(200).json(group)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
