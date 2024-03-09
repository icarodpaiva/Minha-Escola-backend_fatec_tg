import { Router } from "express"

import { auth } from "./auth"
import { students } from "./students"

export const mainRoutes = Router()

mainRoutes.post("/auth", auth)
mainRoutes.use("/students", students)

// TO-DO - Refactoring
import { authenticated } from "../middlewares/authenticated"
import { notificationTopics } from "../middlewares/notificationTopics"
import { sendNotification } from "./notifications/sendNotification"
import { getNotifications } from "./notifications/getNotifications"

// Notifications routes
mainRoutes.post(
  "/notifications",
  authenticated,
  notificationTopics,
  sendNotification
)
mainRoutes.get("/notifications", authenticated, getNotifications)

// TO-DO - Legacy - Delete all below
import CoursesController from "./admin/controllers/CoursesController"
import SubjectController from "./admin/controllers/SubjectController"

// Admin routes:

// COURSES
mainRoutes
  .route("/admin/courses")
  .get(CoursesController.findAll)
  .post(CoursesController.createCourses)
mainRoutes
  .route("/admin/course/:id")
  .get(CoursesController.findById)
  .put(CoursesController.updateCourses)
  .delete(CoursesController.deleteCourses)

// SUBJECTS
mainRoutes
  .route("/admin/subjects")
  .get(SubjectController.findAll)
  .post(SubjectController.createSubject)
mainRoutes
  .route("/admin/subject")
  .get(SubjectController.findById)
  .put(SubjectController.updateSubjects)
  .delete(SubjectController.deleteSubject)
