import { IsNotEmpty, IsString, IsEmail, IsInt } from "class-validator"

export class CreateAndUpdateStudentDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  document!: string

  @IsNotEmpty()
  @IsString()
  sr!: string

  @IsInt()
  semester!: string

  @IsInt()
  course_id!: string
}

export class FindStudentFiltersDto {
  @IsString()
  name!: string

  @IsString()
  semester!: string

  @IsString()
  course_id!: string
}

export interface Student {
  id: number
  name: string
  email: string
  document: string
  sr: string
  semester: string
  course_id: string
  auth_user_id: string
}
