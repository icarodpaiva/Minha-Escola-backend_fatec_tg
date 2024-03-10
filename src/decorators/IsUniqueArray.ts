import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator"

@ValidatorConstraint({ name: "IsUniqueArray", async: false })
export class IsUniqueArray implements ValidatorConstraintInterface {
  validate(array: any[]) {
    if (!Array.isArray(array)) {
      return false
    }

    const uniqueArray = [...new Set(array)]
    return array.length === uniqueArray.length
  }

  defaultMessage() {
    return "the array must contain unique values"
  }
}
