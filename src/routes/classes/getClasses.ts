import { supabase } from "../../databases/supabase"

import { TEACHER } from "../../constants/access_levels"

import type { Request, Response } from "express"

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

export async function getClasses(_: Request, res: Response) {
  try {
    const auth_user_id: string | undefined = res.locals.auth_user_id

    if (!auth_user_id) {
      res.status(403).send("Forbidden")
      return
    }

    const { data: groups, error: groupsError } = (await supabase
      .from("users_groups")
      .select(
        `
          groups(
            id,
            subjects(name),
            classes (
              id,
              start_time,
              end_time,
              locations(
                building,
                floor,
                classroom
              )
            )
          ),
          users()
        `
      )
      .eq("users.auth_user_id", auth_user_id)
      .eq("groups.classes.weekday_id", 3) // TODO - receive the current weekday by param
      .not("users", "is", null)
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

    const groupsIds = groups.map(({ groups: { id } }) => id)

    const { data: teachers, error: teachersError } = (await supabase
      .from("users_groups")
      .select("group_id, users(name)")
      .in("group_id", groupsIds)
      .eq("users.access_level_id", TEACHER)
      .not("users", "is", null)) as {
      data: Teachers[] | null
      error: any
    }

    if (teachersError) {
      res.status(500).send("Internal server error")
      return
    }

    if (!teachers || teachers.length === 0) {
      res.status(404).send("Not found")
      return
    }

    const formattedClasses = groups.reduce(
      (acc, { groups: { id, classes, subjects } }) => {
        const teacher = teachers.find(
          ({ group_id }) => group_id === id
        ) as Teachers

        const classesWithAdditionalInfo = classes.map(classItem => ({
          ...classItem,
          subject: subjects.name,
          teacher: teacher.users.name
        }))

        return [...acc, ...classesWithAdditionalInfo]
      },
      [] as ClassWithAdditionalInfos[]
    )

    res.status(200).send(formattedClasses)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
