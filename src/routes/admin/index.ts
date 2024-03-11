import { Router } from "express"

import { courses } from "./courses"
import { subjects } from "./subjects"
import { groups } from "./groups"

export const admin = Router()

admin.use("/courses", courses)
admin.use("/subjects", subjects)
admin.use("/groups", groups)
