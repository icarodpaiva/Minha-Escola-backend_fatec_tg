import { supabase } from "../../databases/supabase"
import { IsDateString } from "class-validator"
import { validateClass } from "../../utils/validateClass"

import type { Request, Response } from "express"

class ClassesDto {
  @IsDateString()
  date!: string
}

interface Groups {
  groups: {
    subjects: {
      name: string
    }
    staff: {
      name: string | null
    }
    classes: Class[]
  }
}

interface Class {
  id: number
  date: string
  start_time: string
  end_time: string
  locations: Locations
}

interface Locations {
  building: string
  floor: number
  classroom: string
}

export async function classes(req: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    if (is_staff) {
      res.status(400).send("Use staff routes")
      return
    }

    const filters = new ClassesDto()

    filters.date = req.query.date as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const { data: groups, error: groupsError } = (await supabase
      .from("students_groups")
      .select(
        `groups(
          subjects(name),
          staff(name),
          classes(
            id,
            date,
            start_time,
            end_time,
            locations(building, floor, classroom)
          )
        ),
        students()`
      )
      .eq("students.auth_user_id", auth_user_id)
      .eq("groups.classes.date", filters.date)
      .not("students", "is", null)
      .not("groups", "is", null)
      .not("groups.classes", "is", null)) as {
      data: Groups[] | null
      error: any
    }

    if (groupsError) {
      console.log(groupsError)
      res.status(500).send("Internal server error")
      return
    }

    if (!groups?.length) {
      res.status(404).send("Not found")
      return
    }

    const formattedClasses = groups.map(({ groups: studentGroups }) => {
      const {
        staff,
        subjects,
        classes: [{ id, date, start_time, end_time, locations }]
      } = studentGroups

      const { building, floor, classroom } = locations

      return {
        id,
        subject: subjects.name,
        teacher: staff.name,
        date,
        start_time: start_time.slice(0, 5),
        end_time: end_time.slice(0, 5),
        location: {
          building,
          floor,
          classroom
        }
      }
    })

    res.status(200).send(formattedClasses)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
