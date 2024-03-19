import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"
import type { Staff } from "./dto"

export async function findById(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

    const { data, error }: { data: Staff[] | null; error: any } = await supabase
      .from("staff")
      .select("*")
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

    res.status(200).send(data[0])
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
