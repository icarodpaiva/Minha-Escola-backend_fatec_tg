import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"

export async function deleteSubject(req: Request, res: Response) {
  try {
    const { id } = req.params

    const { error } = await supabase.from("subjects").delete().eq("id", id)

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
