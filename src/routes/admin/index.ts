import { Router } from "express"

import { courses } from "./courses"
import { subjects } from "./subjects"
import { groups } from "./groups"
import { classes } from "./classes"
import { locations } from "./locations"
import { notifications } from "./notifications"

export const admin = Router()

admin.use("/courses", courses)
admin.use("/subjects", subjects)
admin.use("/groups", groups)
admin.use("/classes", classes)
admin.use("/locations", locations)
admin.use("/notifications", notifications)
