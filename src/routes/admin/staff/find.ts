import { supabase } from "../../../databases/supabase"
import { validateClass } from "../../../utils/validateClass"
import { FindStaffFiltersDto, FindOptions, Staff } from "./dto"

import type { Request, Response } from "express"

export async function find(req: Request, res: Response) {
  try {
    const filters = new FindStaffFiltersDto()

    filters.name = (req.query.name || "") as string
    filters.is_admin = (req.query.is_admin || "all") as FindOptions

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const query = supabase
      .from("staff")
      .select("*")
      .ilike("name", `%${filters.name}%`)

    if (filters.is_admin !== "all") {
      query.eq("is_admin", filters.is_admin)
    }

    const { data, error }: { data: Staff[] | null; error: any } = await query

    if (error) {
      console.log(error)
      res.status(500).send("Internal server error")
      return
    }

    if (!data?.length) {
      return res.status(200).send([])
    }

    res.status(200).send(data)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
