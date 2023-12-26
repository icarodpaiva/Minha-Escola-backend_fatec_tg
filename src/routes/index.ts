import { Router } from "express"

import { authenticated } from "../middlewares/authenticated"
import { notificationTopics } from "../middlewares/notificationTopics"
import { adminUser } from "../middlewares/adminUser"

import { login } from "./auth/login"

import { sendNotification } from "./notifications/sendNotification"
import { getNotifications } from "./notifications/getNotifications"

import { profile } from "./users/profile"
import { getUser } from "./users/getUser"

import { getClasses } from "./classes/getClasses"

import AccessLevelController from "./admin/controllers/AccessLevelController"
import CoursesController from "./admin/controllers/CoursesController"
import SubjectController from "./admin/controllers/SubjectController"

export const mainRoutes = Router()

// Auth routes
mainRoutes.post("/auth/login", login)

// Notifications routes
mainRoutes.post(
  "/notifications",
  authenticated,
  notificationTopics,
  sendNotification
)
mainRoutes.get("/notifications", authenticated, getNotifications)

// Users routes
mainRoutes.get("/users/profile", authenticated, profile)
mainRoutes.get("/users/:id", authenticated, adminUser, getUser)

// Classes routes
mainRoutes.get("/classes", authenticated, getClasses)

// Admin routes:
// ACCESS LEVEL
mainRoutes.route('/admin/access-levels')
  .get(AccessLevelController.findAll)
  .post(AccessLevelController.createAccess)
mainRoutes.route('/admin/access-level/:id')
  .get(AccessLevelController.findById)
  .put(AccessLevelController.updateAccess)
  .delete(AccessLevelController.deleteAccess)

// COURSES
mainRoutes.route('/admin/courses')
  .get(CoursesController.findAll)
  .post(CoursesController.createCourses)
mainRoutes.route('/admin/course/:id')
  .get(CoursesController.findById)
  .put(CoursesController.updateCourses)
  .delete(CoursesController.deleteCourses)

// SUBJECTS
mainRoutes.route('/admin/subjects')
  .get(SubjectController.findAll)
  .post(SubjectController.createSubject)
mainRoutes.route('/admin/subject')
  .get(SubjectController.findById)
  .put(SubjectController.updateSubjects)
  .delete(SubjectController.deleteSubject)