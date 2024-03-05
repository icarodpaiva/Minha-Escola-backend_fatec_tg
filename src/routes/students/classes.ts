import { supabase } from "../../databases/supabase"
import { IsIn, IsNotEmpty, IsString } from "class-validator"

import {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
} from "../../constants/weekdays"
import { validateClass } from "../../utils/validateClass"

import type { Request, Response } from "express"

class ClassesDto {
  @IsIn(
    [SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY].map(String)
  )
  @IsString()
  @IsNotEmpty()
  date!: string
}

interface Groups {
  groups: {
    id: number
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
          id,
          subjects(name),
          staff(name),
          classes(
            start_time,
            end_time,
            locations(building, floor, classroom)
          )
        ),
        students()`
      )
      .eq("students.auth_user_id", auth_user_id)
      .eq("groups.classes.weekday_id", parseInt(filters.date, 10))
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

    if (!groups || groups.length === 0) {
      res.status(404).send("Not found")
      return
    }

    const formattedClasses = groups.map(({ groups: studentGroups }) => {
      const {
        id,
        staff,
        subjects,
        classes: [{ locations, start_time, end_time }]
      } = studentGroups

      const { building, floor, classroom } = locations

      return {
        id,
        subject: subjects.name,
        teacher: staff.name,
        location: {
          building,
          floor,
          classroom
        },
        start_time,
        end_time
      }
    })

    res.status(200).send(formattedClasses)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
