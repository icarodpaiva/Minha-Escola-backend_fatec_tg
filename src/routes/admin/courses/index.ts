import { Router } from "express"

import { create } from "./create"
import { find } from "./find"
import { findById } from "./findById"
import { update } from "./update"
import { deleteCourse } from "./delete"

import { findCourseSubjects } from "./findCourseSubjects"
import { updateCourseSubjects } from "./updateCourseSubjects"

export const courses = Router()

courses.post("/", create)
courses.get("/", find)
courses.get("/:id", findById)
courses.put("/:id", update)
courses.delete("/:id", deleteCourse)

courses.get("/:id/subjects", findCourseSubjects)
courses.put("/:id/subjects", updateCourseSubjects)
