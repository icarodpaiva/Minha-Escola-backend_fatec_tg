import { Router } from "express"

import { login } from "./login"

export const auth = Router()

auth.post("/login", login)
