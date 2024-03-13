import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator"
import { CourseSubject } from "../routes/admin/courses/dto"

@ValidatorConstraint({ name: "IsSubjectArray", async: false })
export class IsSubjectArray implements ValidatorConstraintInterface {
  validate(value: CourseSubject[]) {
    const isArray = Array.isArray(value)

    if (isArray) {
      return value.reduce(
        (acc, curr) =>
          acc &&
          typeof curr.semester === "number" &&
          typeof curr.subject_id === "number",
        true
      )
    }

    return false
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array with subject_id (number) and semester (number)`
  }
}
