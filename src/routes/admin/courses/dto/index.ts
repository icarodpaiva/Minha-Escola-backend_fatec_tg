import { IsString, IsNotEmpty, IsInt, IsArray, Validate } from "class-validator"
import { IsSubjectArray } from "../../../../decorators/IsSubjectArray"

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

export class CourseSubject {
  @IsInt()
  subject_id!: number

  @IsInt()
  semester!: number
}

export class UpdateCourseSubjectsDto {
  @IsInt()
  course_id!: number

  @IsArray()
  @Validate(IsSubjectArray)
  subjects!: CourseSubject[]
}

export interface Course {
  id: number
  name: string
  description: string
}

export interface CourseSubjectType {
  id: number
  semester: number
  subjects: {
    id: number
    name: string
  }
}
