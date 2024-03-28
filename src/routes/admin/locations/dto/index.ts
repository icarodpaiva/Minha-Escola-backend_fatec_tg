import { IsNotEmpty, IsString, IsInt } from "class-validator"

export class CreateAndUpdateLocationDto {
  @IsNotEmpty()
  @IsString()
  building!: string

  @IsInt()
  floor!: string

  @IsNotEmpty()
  @IsString()
  classroom!: string
}

export class FindLocationFiltersDto {
  @IsString()
  building!: string

  @IsString()
  classroom!: string
}

export interface Location {
  id: number
  building: string
  floor: number
  classroom: string
}
