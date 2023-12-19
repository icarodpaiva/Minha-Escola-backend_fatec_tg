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
  }
}

export async function getNotifications(_: Request, res: Response) {
  try {
    const auth_user_id: string = res.locals.auth_user_id

    const { data: groups, error: groupsError } = (await supabase
      .from("users_groups")
      .select("group_id, users()")
      .eq("users.auth_user_id", auth_user_id)
      .not("users", "is", null)) as {
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

    const groupsIds = groups.map(({ group_id }) => group_id)

    const { data: notifications, error: notificationsError } = (await supabase
      .from("groups_notifications")
      .select(
        `
          groups(
            subjects(name)
          ),
          notifications(
            id,
            created_at,
            title,
            message          
          )          
        `
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

    const formattedNotifications = notifications.map(
      ({ groups, notifications }) => ({
        subject: groups.subjects.name,
        ...notifications
      })
    )

    res.status(200).send(formattedNotifications)
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
