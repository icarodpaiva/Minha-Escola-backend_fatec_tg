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

class GetClassesDto {
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
    classes: Class[]
  }
}

interface Class {
  id: number
  start_time: string
  end_time: string
  locations: Locations
}

interface Locations {
  building: string
  floor: number
  classroom: string
}

interface Teachers {
  group_id: number
  users: {
    name: string
  }
}

interface ClassWithAdditionalInfos extends Class {
  subject: string
  teacher: string
}

export async function classes(req: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean =  res.locals.is_staff

    if (is_staff) {
      res.status(400).send("Use staff routes")
      return
    }

    const filters = new GetClassesDto()

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
          staff(name),
          subjects(name),
          classes(
            id,
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

    res.status(200).send(groups)

    // const groupsIds = groups.map(({ groups: { id } }) => id)

    // const { data: teachers, error: teachersError } = (await supabase
    //   .from("staff_groups")
    //   .select("group_id, users(name)")
    //   .in("group_id", groupsIds)
    //   .eq("users.access_level_id", TEACHER)
    //   .not("users", "is", null)) as {
    //   data: Teachers[] | null
    //   error: any
    // }

    // if (teachersError) {
    //   res.status(500).send("Internal server error")
    //   return
    // }

    // if (!teachers || teachers.length === 0) {
    //   res.status(404).send("Not found")
    //   return
    // }

    // const formattedClasses = groups.reduce(
    //   (acc, { groups: { id, classes, subjects } }) => {
    //     const teacher = teachers.find(
    //       ({ group_id }) => group_id === id
    //     ) as Teachers

    //     const classesWithAdditionalInfo = classes.map(classItem => ({
    //       ...classItem,
    //       subject: subjects.name,
    //       teacher: teacher.users.name
    //     }))

    //     return [...acc, ...classesWithAdditionalInfo]
    //   },
    //   [] as ClassWithAdditionalInfos[]
    // )

    // res.status(200).send(formattedClasses)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
