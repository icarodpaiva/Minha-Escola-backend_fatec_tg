import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator"

@ValidatorConstraint({ name: "IsUniqueArray", async: false })
export class IsTime implements ValidatorConstraintInterface {
  validate(value: any) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    return timeRegex.test(value)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in the format hh-mm`
  }
}
