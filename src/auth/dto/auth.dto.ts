import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsUrl, MinLength } from "class-validator"

export class LogInAuthDto {

  @ApiPropertyOptional({ description: 'Registered email in account'})
  @IsEmail(undefined, { message: "the provided email is invalid" })
  email: string

  @ApiPropertyOptional({ description: 'Registered password in account'})
  @IsNotEmpty()
  password: string

}
