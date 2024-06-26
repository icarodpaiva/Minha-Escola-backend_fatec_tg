import {
  IsOptional,
  IsString,
  IsDateString,
  Validate,
  IsInt
} from "class-validator"
import { IsTime } from "../../../../decorators/IsTime"

import type { Location } from "../../locations/dto"

export class CreateAndUpdateClassDto {
  @IsOptional()
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description!: string

  @IsDateString()
  date!: string

  @Validate(IsTime)
  start_time!: string

  @Validate(IsTime)
  end_time!: string

  @IsInt()
  group_id!: number

  @IsInt()
  location_id!: number
}

export class FindClassFiltersDto {
  @IsString()
  name!: string

  @IsString()
  description!: string
}

export interface ClassResponse {
  id: number
  name: string | null
  description: string | null
  date: string
  start_time: string
  end_time: string
  group_id: number
  location_id: number
  locations: Omit<Location, "id">
  groups: { name: string; subjects: { name: string } }
}

export interface Class extends Omit<ClassResponse, "locations" | "groups"> {
  location: Omit<Location, "id">
  group_name: string
  subject_name: string
}
