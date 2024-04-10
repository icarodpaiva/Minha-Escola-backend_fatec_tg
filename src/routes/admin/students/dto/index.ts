import { IsNotEmpty, IsString, IsEmail, IsInt, IsUUID } from "class-validator"

export class CreateStudentDto {
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

export class UpdateStudentDto extends CreateStudentDto {
  @IsUUID()
  auth_user_id!: string
}

export class FindStudentFiltersDto {
  @IsString()
  name!: string

  @IsString()
  semester!: string

  @IsString()
  course_id!: string
}

export interface StudentResponse {
  id: number
  name: string
  email: string
  document: string
  sr: string
  semester: string
  course_id: string
  courses: {
    name: string
  }
  auth_user_id: string
}

export interface Student extends Omit<StudentResponse, "courses"> {
  course_name: string
}
