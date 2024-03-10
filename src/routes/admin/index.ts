import { Router } from "express"

import { courses } from "./courses"
import { subjects } from "./subjects"

export const admin = Router()

admin.use("/courses", courses)
admin.use("/subjects", subjects)
