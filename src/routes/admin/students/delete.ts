import { supabase } from "../../../databases/supabase"

import type { Request, Response } from "express"

export async function deleteStudent(req: Request, res: Response) {
  try {
    const { id } = req.params

    if (!id) {
      res.status(400).send("Missing id parameter")
      return
    }

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
