import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"
import type { Subject } from "./dto"

export async function findById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error }: { data: Subject[] | null; error: any } =
      await supabase.from("subjects").select("*").eq("id", id).limit(1)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data || !data.length) {
      res.status(404).send("Not found")
      return
    }

    res.status(200).send(data[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
