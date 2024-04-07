import { supabase } from "../../databases/supabase"

import type { Request, Response } from "express"

interface Groups {
  group_id: number
}

interface Notifications {
  groups: {
    subjects: {
      name: string
    }
  }
  notifications: {
    id: number
    created_at: string
    title: string
    message: string
    staff: {
      name: string
    }
  }
}

interface FormattedNotification {
  id: number
  created_at: string
  title: string
  message: string
  subject: string
  author: string
}

export async function notifications(_: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id
    const is_staff: boolean = res.locals.is_staff

    const query = supabase
      .from("students_groups")
      .select("group_id, students(), groups(staff())")

    if (is_staff) {
      query
        .eq("groups.staff.auth_user_id", auth_user_id)
        .not("groups", "is", null)
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
      res.status(404).send("Not found")
      return
    }

    const groupsIds = groups.map(({ group_id }) => group_id)

    const { data: notifications, error: notificationsError } = (await supabase
      .from("groups_notifications")
      .select(
        `groups(
          subjects(name)
        ),
        notifications(
          id,
          created_at,
          title,
          message,
          staff(name)
        )`
      )
      .in("groups.id", groupsIds)
      .not("groups", "is", null)
      .not("notifications", "is", null)
      .order("created_at", { ascending: false })) as {
      data: Notifications[] | null
      error: any
    }

    if (notificationsError) {
      console.log(notificationsError)
      res.status(500).send("Internal server error")
      return
    }

    if (!notifications || notifications.length === 0) {
      res.status(404).send("Not found")
      return
    }

    const uniqueNotifications: FormattedNotification[] = []

    // TO-DO: Transform subject in a list of subjects
    notifications.forEach(notification => {
      const existingNotification = uniqueNotifications.find(
        ({ id }) => notification.notifications.id === id
      )

      if (!existingNotification) {
        const {
          groups: { subjects },
          notifications: { staff, ...rest }
        } = notification

        uniqueNotifications.push({
          ...rest,
          subject: subjects.name,
          author: staff.name
        })
      }
    })

    res.status(200).send(uniqueNotifications)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
