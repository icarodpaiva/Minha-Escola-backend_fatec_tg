import { IsString, IsNotEmpty } from "class-validator"

export class CreateAndUpdateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  description!: string
}

export class FindSubjectFiltersDto {
  @IsString()
  name!: string
}

export interface Subject {
  id: number
  name: string
  description: string
}
