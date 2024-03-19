import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsIn
} from "class-validator"

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  document!: string

  @IsBoolean()
  is_admin!: boolean
}

export class UpdateStaffDto extends CreateStaffDto {
  @IsUUID()
  auth_user_id!: string
}

export type FindOptions = "all" | "true" | "false"

export const findOptions: FindOptions[] = ["all", "true", "false"]

export class FindStaffFiltersDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsIn(findOptions)
  is_admin!: FindOptions
}

export interface Staff {
  id: number
  name: string
  email: string
  document: string
  is_admin: boolean
  auth_user_id: string
}
