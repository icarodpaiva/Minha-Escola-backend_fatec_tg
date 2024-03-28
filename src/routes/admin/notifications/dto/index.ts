import { IsNotEmpty, IsString, IsInt } from "class-validator"

export class CreateAndUpdateNotificationDto {
  @IsNotEmpty()
  @IsString()
  title!: string

  @IsNotEmpty()
  @IsString()
  message!: string

  @IsInt()
  staff_id!: number
}

export class FindNotificationFiltersDto {
  @IsString()
  title!: string
}

export interface Notification {
  id: number
  title: string
  description: string
}
