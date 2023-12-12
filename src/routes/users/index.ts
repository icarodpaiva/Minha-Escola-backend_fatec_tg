import { Router } from "express"

import { getUser } from "./getUser"

export const usersController = Router()

usersController.get("/:id", getUser)
