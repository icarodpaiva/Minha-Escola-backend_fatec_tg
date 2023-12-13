import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Class {
  id: number
  start_time: string
  end_time: string
  groups: Groups
  locations: Locations
}

interface Groups {
  id: number
  subjects: {
    name: string
  }
}

interface Locations {
  building: string
  floor: number
  classroom: string
}

export async function getClasses(_: Request, res: Response) {
  try {
    const {
      data: classes,
      error: classesError
    }: { data: Class[] | null; error: any } = await supabase
      .from("classes")
      .select(
        `
          id,
          start_time,
          end_time,
          groups(
            id,
            subjects(name)
          ),
          locations(
            building,
            floor,
            classroom
          )            
        `
      )

    if (classesError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!classes || classes.length === 0) {
      res.status(404).send("Not found")
      return
    }

    res.status(200).send(classes)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
