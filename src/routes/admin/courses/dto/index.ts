import { IsString, IsNotEmpty } from "class-validator"

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

export interface Course {
  id: number
  name: string
  description: string
}
