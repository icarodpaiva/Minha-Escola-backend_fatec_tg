import { Router } from "express"
import { getUser } from "./users/getUser"

export const mainRoutes = Router()

mainRoutes.get("/users/:id", getUser)
