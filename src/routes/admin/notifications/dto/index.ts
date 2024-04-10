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

export interface NotificationResponse {
  id: number
  created_at: string
  title: string
  message: string
  staff_id: number
  staff: {
    name: string
  }
}

export interface Notification extends Omit<NotificationResponse, 'staff'> {
  staff_name: string
}
