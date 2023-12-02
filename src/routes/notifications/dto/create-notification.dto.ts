import { ArrayMinSize, IsArray, IsString, MaxLength } from "class-validator"
import { Type } from "class-transformer"

export class CreateNotificationDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  topics!: string[]

  @MaxLength(30)
  @IsString()
  title!: string

  @MaxLength(100)
  @IsString()
  message!: string
}
