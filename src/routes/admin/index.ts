import { Router } from "express"

import { courses } from "./courses"

export const admin = Router()

admin.use("/courses", courses)
