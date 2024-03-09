import { IsString, IsNotEmpty } from "class-validator"

export class CreateAndUpdateCourseDto {
  @IsString()
  @IsNotEmpty()
  name!: string

  @IsString()
  @IsNotEmpty()
  description!: string
}
