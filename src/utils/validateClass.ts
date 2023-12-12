import { validate } from "class-validator"

import type { ValidationError } from "class-validator"

export const validateClass = async (
  classToValidate: any
): Promise<string | false> => {
  if (!classToValidate) {
    throw new Error("class to validate is required")
  }

  const errors: ValidationError[] = await validate(classToValidate)

  if (errors.length > 0) {
    return errors
      .map(error => Object.values(error.constraints ?? {}).join(", "))
      .join(", ")
  } else {
    return false
  }
}
