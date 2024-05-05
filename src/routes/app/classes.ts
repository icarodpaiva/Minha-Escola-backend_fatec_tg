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
    name: string
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
  name: string | null
  description: string | null
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

interface FormattedClass extends Omit<Class, "locations"> {
  subject: string
  group_name: string
  teacher: string | null
  location: Locations
}

export async function classes(req: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    const filters = new ClassesDto()

    filters.date = req.query.date as string

    const errors = await validateClass(filters)

    if (errors) {
      return res.status(400).send(errors)
    }

    const query = supabase
      .from("students_groups")
      .select(
        `groups(
          name,
          subjects(name),
          staff(name),
          classes(
            id,
            name,
            description,
            date,
            start_time,
            end_time,
            locations(building, floor, classroom)
          )
        ),
        students()`
      )
      .eq("groups.classes.date", filters.date)
      .not("groups", "is", null)
      .not("groups.classes", "is", null)

    if (is_staff) {
      query
        .eq("groups.staff.auth_user_id", auth_user_id)
        .not("groups.staff", "is", null)
    } else {
      query
        .eq("students.auth_user_id", auth_user_id)
        .not("students", "is", null)
    }

    const { data: groups, error: groupsError } = (await query) as {
      data: Groups[] | null
      error: any
    }

    if (groupsError) {
      console.log(groupsError)
      res.status(500).send("Internal server error")
      return
    }

    if (!groups?.length) {
      return res.status(200).send([])
    }

    const formattedClasses: FormattedClass[] = []

    groups.forEach(({ groups: dayGroups }) => {
      const { name: group_name, staff, subjects, classes } = dayGroups

      classes.forEach(dayClass => {
        const {
          id,
          name,
          description,
          date,
          start_time,
          end_time,
          locations: location
        } = dayClass

        formattedClasses.push({
          id,
          subject: subjects.name,
          group_name,
          teacher: staff.name,
          name,
          description,
          date,
          start_time: start_time.slice(0, 5),
          end_time: end_time.slice(0, 5),
          location
        })
      })
    })

    formattedClasses.sort((a, b) => a.start_time.localeCompare(b.start_time))

    res.status(200).send(formattedClasses)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
