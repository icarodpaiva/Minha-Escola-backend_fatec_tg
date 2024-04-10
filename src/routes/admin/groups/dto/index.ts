import { IsString, IsNotEmpty, IsInt, IsIn, IsOptional } from "class-validator"

const SEMESTER_VALUES = ["1", "2", "1-2"] as const

export class CreateAndUpdateGroupDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsInt()
  year!: number

  @IsIn(SEMESTER_VALUES)
  semester!: Semester

  @IsInt()
  subject_id!: number

  @IsOptional()
  @IsInt()
  teacher_id!: number | null
}

export class FindGroupFiltersDto {
  @IsString()
  name!: string
}

export interface GroupResponse {
  id: number
  name: string
  year: number
  semester: Semester
  subject_id: number
  teacher_id: number | null
  subjects: {
    name: string
  }
  staff: { name: string } | null
}

export interface Group extends Omit<GroupResponse, "subjects" | "staff"> {
  subject_name: string
  teacher_name: string | null
}

type Semester = (typeof SEMESTER_VALUES)[number]

export interface GroupNotifications {
  id: number
  notifications: {
    id: number
    title: string
    message: string
    staff: {
      id: number
      name: string
    }
  }
}

export interface GroupStudentsType {
  id: number
  students: {
    id: number
    name: string
    email: string
    semester: number
    courses: { name: string }
  }
}
