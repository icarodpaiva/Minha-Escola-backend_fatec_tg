import { IsString, IsNotEmpty, IsInt, IsArray, Validate } from "class-validator"
import { IsUniqueArray } from "../../../../decorators/IsUniqueArray"

export class CreateAndUpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  description!: string
}

export class FindCourseFiltersDto {
  @IsString()
  name!: string
}

export class UpdateCourseSubjectsDto {
  @IsInt()
  course_id!: number

  @Validate(IsUniqueArray)
  @IsInt({ each: true })
  @IsArray()
  subject_ids!: number[]
}

export interface Course {
  id: number
  name: string
  description: string
}
