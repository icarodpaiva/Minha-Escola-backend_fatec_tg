import { Router } from "express"

import { courses } from "./courses"
import { subjects } from "./subjects"
import { groups } from "./groups"
import { classes } from "./classes"
import { locations } from "./locations"

export const admin = Router()

admin.use("/courses", courses)
admin.use("/subjects", subjects)
admin.use("/groups", groups)
admin.use("/classes", classes)
admin.use("/locations", locations)
