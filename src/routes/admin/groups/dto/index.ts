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

export interface Group {
  id: number
  name: string
  year: number
  semester: Semester
  subject_id: number
  teacher_id: number | null
}

type Semester = (typeof SEMESTER_VALUES)[number]
